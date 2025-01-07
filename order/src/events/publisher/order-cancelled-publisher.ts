// order-cancelled-publisher
import { Publisher, Subjects, OrderCancelledEvent } from "@goodmanltd/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
