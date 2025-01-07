import { Subjects } from "./subjects";

export interface PaymentIntentCreatedEvent {
  subject: Subjects.PaymentIntentCreated;
  data: {
    id: string;
    orderId: string;
    paymentIntentId: string;
  };
}
