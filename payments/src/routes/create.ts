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
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { stripe } from "../stripe";

const router = Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("token").not().isEmpty(),
    body("orderId").not().isEmpty(),
    validateRequest,
  ],
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError("Payments not allowed on cancelled order!");

    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: "https://ticketing.dev/success",
      cancel_url: "https://ticketing.dev/failure",
      line_items: [
        {
          name: `ticket-order-${order.id}`,
          currency: "INR",
          amount: order.price * 100,
          quantity: 1,
        },
      ],
    });
    // console.log("Payment status: ", checkout.payment_status);
    const payment = Payment.build({
      orderId: orderId,
      stripeId: checkout.id,
      paymentId: checkout.payment_intent!.toString(),
    });
    await payment.save();

    res.status(201).send({ success: true });
  }
);

export { router as createChargeRouter };
