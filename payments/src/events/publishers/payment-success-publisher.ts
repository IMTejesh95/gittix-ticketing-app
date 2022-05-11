import { PaymentSuccessEvent, Publisher, Subjects } from "@tjgittix/common";

export class PaymentSuccessPublisher extends Publisher<PaymentSuccessEvent> {
  subject: Subjects.PaymentSuccess = Subjects.PaymentSuccess;
}
