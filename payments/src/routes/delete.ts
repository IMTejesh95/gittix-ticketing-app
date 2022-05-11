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
    const { orderId } = req.params;
    console.log("In payment delete route: ", orderId);
    const payment = await Payment.findOne({ orderId });
    if (!payment) throw new NotFoundError();

    await payment.delete();
    await new PaymentFailedPublisher(stan.client).publish({
      orderId,
    });

    res.status(204);
  }
);

export { router as deletePaymentRouter };
