import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@tjgittix/common";
import { Request, Response, Router } from "express";
import { stan } from "../events/nats-client";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { Order } from "../models/order";

const router = Router();

router.patch(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate("ticket");
    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    order.status = OrderStatus.Cancelled;
    await order.save();

    new OrderCancelledPublisher(stan.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.send(order);
  }
);

export { router as cancelOrderRouter };
