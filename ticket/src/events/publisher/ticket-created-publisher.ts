// ticket-created-publisher
import { Publisher, Subjects, TicketCreatedEvent } from "@goodmanltd/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
