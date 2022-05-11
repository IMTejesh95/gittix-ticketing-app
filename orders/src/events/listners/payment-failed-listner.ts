import {
  Listner,
  OrderStatus,
  PaymentFailedEvent,
  Subjects,
} from "@tjgittix/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { QUEUE_GROUP_NAME } from "./queue-group-name";

export class PaymentFailedListner extends Listner<PaymentFailedEvent> {
  subject: Subjects.PaymentFailed = Subjects.PaymentFailed;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(
    data: PaymentFailedEvent["data"],
    message: Message
  ): Promise<void> {
    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) throw new Error("Order does not exist");

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    message.ack();
  }
}
