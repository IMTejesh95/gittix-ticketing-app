import { OrderCompleteEvent, Publisher, Subjects } from "@tjgittix/common";

export class OrderCompletePublisher extends Publisher<OrderCompleteEvent> {
  subject: Subjects.OrderComplete = Subjects.OrderComplete;
}
