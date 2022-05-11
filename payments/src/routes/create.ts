import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@tjgittix/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { stan } from "../events/nats-client";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { stripe } from "../stripe";

const router = Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("orderId").not().isEmpty().withMessage("Order ID is required")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError("Payments not allowed on cancelled order!");

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${process.env.STRIPE_SUCCESS_URL!}?order=${orderId}`,
      cancel_url: `${process.env.STRIPE_CANCEL_URL!}?order=${orderId}`,
      line_items: [
        {
          name: `ticket-order-${order.id}`,
          currency: "INR",
          amount: Math.floor(order.price * 100),
          quantity: 1,
        },
      ],
      customer_email: req.currentUser!.email,
      expires_at: Math.floor(new Date(order.expiresAt).getTime() / 1000),
    });

    const payment = Payment.build({
      orderId: orderId,
      checkoutSessionId: checkoutSession.id,
    });
    await payment.save();

    res.status(201).send({ ...payment, redirect_url: checkoutSession.url! });
  }
);

export { router as createPaymentSessionRouter };
