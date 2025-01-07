// ticket-created-listener.ts

import { Listener, Subjects, TicketCreatedEvent } from "@goodmanltd/common";
import { Message } from "node-nats-streaming";
import { QueueGroupName } from "./queueGroupName";
import { Ticket } from "../../model/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = QueueGroupName;
  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    // save the data in the local Ticket mongo db collection
    const ticket = Ticket.build({
      id: data.id,
      title: data.title,
      price: data.price,
    });
    await ticket.save();
    // call ack when we successfully processed the msg
    msg.ack();
  }
}
