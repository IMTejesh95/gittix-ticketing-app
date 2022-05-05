import { Publisher, Subjects, OrderCancelledEvent } from "@tjgittix/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
