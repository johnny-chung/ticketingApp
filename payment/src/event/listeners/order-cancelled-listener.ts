import {
  Listener,
  NotFoundError,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@goodmanltd/common";
import { QueueGroupName } from "./queueGroupName";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = QueueGroupName;
  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // find by id and version
    const order = await Order.findByEvent(data);
    if (!order) throw new NotFoundError();

    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    msg.ack();
  }
}
