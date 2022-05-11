import {
  Listner,
  OrderStatus,
  PaymentSuccessEvent,
  Subjects,
} from "@tjgittix/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCompletePublisher } from "../publishers/order-complete-listner";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class PaymentSuccessListner extends Listner<PaymentSuccessEvent> {
  subject: Subjects.PaymentSuccess = Subjects.PaymentSuccess;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(
    data: PaymentSuccessEvent["data"],
    message: Message
  ): Promise<void> {
    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) throw new Error("Order does not exist");

    order.set({ status: OrderStatus.Complete });
    await order.save();

    await new OrderCompletePublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    message.ack();
  }
}
