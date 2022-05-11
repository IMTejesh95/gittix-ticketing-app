import { Subjects } from "./subjects";

export interface PaymentCompleteEvent {
  subject: Subjects.PaymentComplete;
  data: {
    orderId: string;
    checkoutSessionId: string;
  };
}
