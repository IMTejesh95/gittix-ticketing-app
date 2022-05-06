import { Listner, OrderCreatedEvent, Subjects } from "@tjgittix/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { QUEUE_GROUP_NAME } from "../queue-group-name";

export class OrderCreatedListner extends Listner<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = QUEUE_GROUP_NAME;

  async onMessage(
    data: OrderCreatedEvent["data"],
    message: Message
  ): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    expirationQueue.add({ orderId: data.id }, { delay: 5000 });
    message.ack();
  }
}
