// lock the ticket and prevent further amendment if an order is placed

import { Listener, OrderCancelledEvent, OrderCreatedEvent, Subjects } from "@goodmanltd/common";
import { QueueGroupName } from "./QueueGroupName";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../model/ticket";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = QueueGroupName;
  async onMessage(order: OrderCancelledEvent["data"], msg: Message) {

    const { ticket: orderTicket } = order;
    // find the ticket
    const ticket = await Ticket.findById(orderTicket.id);
    if (!ticket) throw new Error("Ticket not found");
    // update the orderId of the ticket
    ticket.set({ orderId: undefined });
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
