import {
  Listener,
  OrderStatus,
  PaymentIntentCreatedEvent,
  Subjects,
} from "@goodmanltd/common";
import { QueueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/order";

export class PaymentIntentCreatedListener extends Listener<PaymentIntentCreatedEvent> {
  readonly subject = Subjects.PaymentIntentCreated;
  queueGroupName = QueueGroupName;
  async onMessage(data: PaymentIntentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) throw new Error("Order not found");


    order.set({ status: OrderStatus.Complete });

    await order.save();
    // should emit an order update event here
    
    msg.ack();
  }
}
