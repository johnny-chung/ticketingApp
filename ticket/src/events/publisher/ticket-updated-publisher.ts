// ticket-created-publisher
import { Publisher, Subjects, TicketUpdatedEvent } from "@goodmanltd/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
