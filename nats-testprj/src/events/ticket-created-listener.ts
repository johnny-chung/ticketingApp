import { Message } from "node-nats-streaming";
import { Listener } from "./abstract-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // add type checking to subject name and data type
  // readonly -> ts will prevent it to change to other value in enum
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payment-service";
  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log(`Event Msg: ${msg}`);

    // return an acknowledgement to NATS -> tell NATS msg was handled -> x resend
    msg.ack();
  }
}
