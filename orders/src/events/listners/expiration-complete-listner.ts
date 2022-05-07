import {
  ExpirationCompleteEvent,
  Listner,
  OrderStatus,
  Subjects,
} from "@tjgittix/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class ExpirationCompleteListner extends Listner<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(
    data: ExpirationCompleteEvent["data"],
    message: Message
  ): Promise<void> {
    const expiredOrder = await Order.findById(data.orderId);
    if (!expiredOrder) throw new Error("Order does not exist!");

    if (expiredOrder.status === OrderStatus.Complete) return message.ack();

    expiredOrder.set({ status: OrderStatus.Cancelled });
    await expiredOrder.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: expiredOrder.id,
      version: expiredOrder.id,
      ticket: {
        id: expiredOrder.ticket.id,
      },
    });

    return message.ack();
  }
}
