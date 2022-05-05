import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@tjgittix/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";

const router = Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      // .custom((input: string) => {
      //   mongoose.Types.ObjectId.isValid(input);
      // })
      .withMessage("Ticket ID is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.body.ticketId);
    if (!ticket) throw new NotFoundError();
    const isReserved = await ticket.isReserved();
    if (isReserved) throw new BadRequestError("Ticket is already reserved");

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      ticket,
      expiresAt: expiration,
    });
    await order.save();

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
