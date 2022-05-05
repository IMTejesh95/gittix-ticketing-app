import { Publisher, Subjects, OrderCreatedEvent } from "@tjgittix/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
