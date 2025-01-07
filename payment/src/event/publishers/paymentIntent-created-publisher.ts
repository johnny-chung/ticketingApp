// order-created-publisher
import {
  Publisher,
  Subjects,
  PaymentIntentCreatedEvent,
} from "@goodmanltd/common";

export class PaymentIntentCreatedPublisher extends Publisher<PaymentIntentCreatedEvent> {
  readonly subject = Subjects.PaymentIntentCreated;
}
