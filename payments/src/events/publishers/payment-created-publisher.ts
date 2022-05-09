import { PaymentCreatedEvent, Publisher, Subjects } from "@tjgittix/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
