// lock the ticket and prevent further amendment if an order is placed

import { Listener, OrderCreatedEvent, Subjects } from "@goodmanltd/common";
import { QueueGroupName } from "./QueueGroupName";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../model/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = QueueGroupName;
  async onMessage(order: OrderCreatedEvent["data"], msg: Message) {
    const { id: orderId, ticket: orderTicket } = order;
    // find the ticket
    const ticket = await Ticket.findById(orderTicket.id);
    if (!ticket) throw new Error("Ticket not found");
    // update the orderId of the ticket
    ticket.set({ orderId: orderId });
    await ticket.save();

    // since we updated the ticket orderId
    // we need to emit an event
    // add await to ensure success b4 ack
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    msg.ack();
  }
}
