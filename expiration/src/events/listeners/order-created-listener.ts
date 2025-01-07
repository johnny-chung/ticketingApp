// events/listeners/order-created-listener

import { Listener, OrderCreatedEvent, Subjects } from "@goodmanltd/common";
import { QueueGroupName } from "./QueueGroupName";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { differenceInMilliseconds, parseISO } from "date-fns";
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = QueueGroupName;
  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // calculate the time difference in ms
    const expiresAtDate = parseISO(data.expiresAt);
    const delayMS = differenceInMilliseconds(expiresAtDate, new Date());
    console.log(`delay time in ms ${delayMS}`);
    // enqueue to Queue
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: delayMS,
      }
    );
    msg.ack();
  }
}
