import {
  ExpirationCompleteEvent,
  OrderStatus,
  TicketCreatedEvent,
} from "@goodmanltd/common";
import { natsClient } from "../../../nats-client";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../model/ticket";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../model/order";

const fakeTicketId = new mongoose.Types.ObjectId().toHexString();

async function setUp() {
  // create an instance of listener
  const listener = new ExpirationCompleteListener(natsClient.client);
  // create a fake data event/ an obj
  const ticket = Ticket.build({
    id: fakeTicketId,
    title: "test ticket",
    price: 999,
  });
  await ticket.save();
  const order = Order.build({
    userId: "test user",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  // fake event obj
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // a fake msg obj
  //@ts-ignore
  const msg: Message = {
    // mock the ack method
    ack: jest.fn(),
  };
  return { listener, data, order, msg };
}

it("cancel the order", async () => {
  const { listener, data, order, msg } = await setUp();
  // call onMessage
  await listener.onMessage(data, msg);

  // ensure order is cancelled
  const udpatedOrder = await Order.findById(order.id);
  expect(udpatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emit an OrderCancelled event", async () => {
  const { listener, data, order, msg } = await setUp();
  // call onMessage
  await listener.onMessage(data, msg);

  // since the natsClient.client is a mock fnc
  expect(natsClient.client.publish).toHaveBeenCalled();
  // extract the event from mock function
  const orderUpdatedData = JSON.parse(
    (natsClient.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(orderUpdatedData.id).toEqual(order.id);
});

it("ack the message", async () => {
  const { listener, data, msg } = await setUp();

  // call onMessage
  await listener.onMessage(data, msg);
  // ensure ack is called
  expect(msg.ack).toHaveBeenCalled();
});
