import {
  Listner,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@tjgittix/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class PaymentCreatedListner extends Listner<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(
    data: PaymentCreatedEvent["data"],
    message: Message
  ): Promise<void> {
    const order = await Order.findById(data.orderId);
    if (!order) throw new Error("Order does not exist!");

    order.set({ status: OrderStatus.Complete });
    await order.save();

    message.ack();
  }
}
