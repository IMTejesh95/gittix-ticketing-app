import { BadRequestError, NotFoundError, requireAuth } from "@tjgittix/common";
import { Request, Response, Router } from "express";
import { stan } from "../events/nats-client";
import { PaymentSuccessPublisher } from "../events/publishers/payment-success-publisher";
import { Payment } from "../models/payment";
import { stripe } from "../stripe";

const router = Router();

router.get(
  "/api/payments/success/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    console.log("/api/payments/success::handler: ", req.params.orderId);
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
    ) {
      await new PaymentSuccessPublisher(stan.client).publish({
        orderId: payment.orderId,
        checkoutSessionId: payment.checkoutSessionId,
      });
    }
    console.log("/api/payments/success::handler: responded");

    res.redirect("/orders");
  }
);

export { router as paymentSuccessCallbackRouter };