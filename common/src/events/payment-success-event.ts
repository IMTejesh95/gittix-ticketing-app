import { Subjects } from "./subjects";

export interface PaymentCompleteEvent {
  subject: Subjects.PaymentSuccess;
  data: {
    orderId: string;
    checkoutSessionId: string;
  };
}
