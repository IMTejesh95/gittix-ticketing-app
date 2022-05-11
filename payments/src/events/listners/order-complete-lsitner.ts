import {
  Listner,
  OrderCompleteEvent,
  OrderStatus,
  Subjects,
} from "@tjgittix/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { QUEUE_GROUP_NAME } from "../queue-group-name";

export class OrderCompleteListner extends Listner<OrderCompleteEvent> {
  subject: Subjects.OrderComplete = Subjects.OrderComplete;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(
    data: OrderCompleteEvent["data"],
    message: Message
  ): Promise<void> {
    const order = await Order.findByEventData(data);
    if (!order) throw new Error("Order not found");

    order.set({ status: OrderStatus.Complete });
    await order.save();

    message.ack();
  }
}
