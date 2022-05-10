import { PaymentFailedEvent, Publisher, Subjects } from "@tjgittix/common";

export class PaymentFailedPublisher extends Publisher<PaymentFailedEvent> {
  subject: Subjects.PaymentFailed = Subjects.PaymentFailed;
}
