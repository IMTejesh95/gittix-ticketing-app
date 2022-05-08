import {
  Listner,
  NotFoundError,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@tjgittix/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { QUEUE_GROUP_NAME } from "../queue-group-name";

export class OrderCancelledListner extends Listner<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(
    data: OrderCancelledEvent["data"],
    message: Message
  ): Promise<void> {
    const order = await Order.findByEventData(data);

    if (!order) throw new Error("Order not found");

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    message.ack();
  }
}
