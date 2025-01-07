import { OrderCreatedEvent, OrderStatus } from "@goodmanltd/common";
import { natsClient } from "../../../nats-client";
import { OrderCreatedListener } from "../order-created-listener";
import { Ticket } from "../../../model/ticket";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const fakeOrderId = new mongoose.Types.ObjectId().toHexString();

async function setup() {
  // natsClient -> a mock function as we set it up in setup
  const listener = new OrderCreatedListener(natsClient.client);

  const ticket = Ticket.build({
    title: "test ticket",
    price: 99,
    userId: "abc1234",
  });
  await ticket.save();

  // fake order
  const data: OrderCreatedEvent["data"] = {
    id: fakeOrderId,
    version: 0,
    userId: "newOrderUser",
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // a fake msg obj
  //@ts-ignore
  const msg: Message = {
    // mock the ack method
    ack: jest.fn(),
  };
  return { listener, ticket, data, msg };
}

describe.only("Order-Created-Listener", () => {
  it("set the orderId of the ticket", async () => {
    const { listener, ticket, data, msg } = await setup();

    // call on message
    await listener.onMessage(data, msg);

    const updateTicket = await Ticket.findById(ticket.id);
    // assert orderId in ticket equal to order id
    expect(updateTicket!.orderId).toEqual(fakeOrderId);
  });
  it("ack the knowledge", async () => {
    const { listener, ticket, data, msg } = await setup();

    // call on message
    await listener.onMessage(data, msg);

    // call the ack message
    expect(msg.ack).toHaveBeenCalled();
  });
  it("publish a ticket updated event", async () => {
    const { listener, ticket, data, msg } = await setup();
    // call on message
    await listener.onMessage(data, msg);

    // since the natsClient.client is a mock fnc
    expect(natsClient.client.publish).toHaveBeenCalled();
    // extract the event from mock function
    const ticketUpdatedData = JSON.parse(
      (natsClient.client.publish as jest.Mock).mock.calls[0][1]
    );
    expect(ticketUpdatedData.orderId).toEqual(data.id);
  });
});
