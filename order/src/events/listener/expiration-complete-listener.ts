import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from "@goodmanltd/common";
import { QueueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/order";
import { OrderCancelledPublisher } from "../publisher/order-cancelled-publisher";
import { natsClient } from "../../nats-client";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  queueGroupName = QueueGroupName;
  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    // since we need to get the ticket info -> populate
    const order = await Order.findById(data.orderId).populate("ticket");
    //console.log(`data orderId: ${data.orderId}`);
    if (!order) throw new Error("Order not found");

    // don;t cancel if order is paid
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    // update the order
    order.set({
      status: OrderStatus.Cancelled,
      // don't need to reset ticket
      // user can still see what ticket they cancelled
      // the isReserved in ticket will not check if order status is cancelled
    });
    await order.save();
    //console.log(`event order id: ${order.id}`);
    new OrderCancelledPublisher(natsClient.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    msg.ack();
  }
}
