import { BadRequestError, NotFoundError, requireAuth } from "@tjgittix/common";
import { Request, Response, Router } from "express";
import { stan } from "../events/nats-client";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { Payment } from "../models/payment";
import { stripe } from "../stripe";

export const paymentSuccessCallbackRouter = Router();

paymentSuccessCallbackRouter.get(
  "/api/payments/success/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment) throw new NotFoundError();

    const checkoutSession = await stripe.checkout.sessions.retrieve(
      payment.checkoutSessionId
    );
    if (!checkoutSession)
      throw new BadRequestError(
        "Failed to checkout session for the available id"
      );

    if (
      checkoutSession.status === "complete" &&
      checkoutSession.payment_status === "paid"
    )
      await new PaymentCreatedPublisher(stan.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        checkoutSessionId: payment.checkoutSessionId,
      });

    res.status(200);
  }
);
