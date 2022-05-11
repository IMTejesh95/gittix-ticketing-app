import { Subjects } from "./subjects";

export interface PaymentSuccessEvent {
  subject: Subjects.PaymentSuccess;
  data: {
    orderId: string;
    checkoutSessionId: string;
  };
}
