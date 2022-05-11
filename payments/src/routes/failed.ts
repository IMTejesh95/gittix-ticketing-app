import { NotFoundError, requireAuth } from "@tjgittix/common";
import { Request, Response, Router } from "express";
import { stan } from "../events/nats-client";
import { PaymentFailedPublisher } from "../events/publishers/payment-failed-publisher";
import { Payment } from "../models/payment";

const router = Router();

router.delete(
  "/api/payments/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    console.log("/api/payments/failed::handler: ", req.params.orderId);
    const { orderId } = req.params;
    const payment = await Payment.findOne({ orderId });
    if (!payment) throw new NotFoundError();

    await payment.delete();
    await new PaymentFailedPublisher(stan.client).publish({
      orderId,
    });
    console.log("/api/payments/failed::handler: responded");
    res.redirect("/orders");
  }
);

export { router as deletePaymentRouter };
