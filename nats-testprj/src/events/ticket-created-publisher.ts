// ticket-created-publisher
import { Publisher } from "./abstract-publisher";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payment-service";
}
