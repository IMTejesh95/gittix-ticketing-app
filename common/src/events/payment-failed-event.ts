import { Subjects } from "./subjects";

export interface PaymentFailedEvent {
  subject: Subjects.PaymentFailed;
  data: {
    orderId: string;
  };
}
