import { TicketCreatedEvent } from "@goodmanltd/common";
import { natsClient } from "../../../nats-client";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../model/ticket";

const fakeId = new mongoose.Types.ObjectId().toHexString();

async function setUp() {
  // create an instance of listener
  const listener = new TicketCreatedListener(natsClient.client);
  // create a fake data event/ an obj
  const data: TicketCreatedEvent["data"] = {
    id: fakeId,
    version: 0,
    title: "test ticket",
    price: 999,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // a fake msg obj
  //@ts-ignore
  const msg: Message = {
    // mock the ack method
    ack: jest.fn(),
  };
  return { listener, data, msg };
}

it("create and save a ticket", async () => {
  const { listener, data, msg } = await setUp();
  // call onMessage
  await listener.onMessage(data, msg);

  // ensure ticket is created
  const ticket = await Ticket.findById(fakeId);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
});

it("ack the message", async () => {
  const { listener, data, msg } = await setUp();

  // call onMessage
  await listener.onMessage(data, msg);
  // ensure ack is called
  expect(msg.ack).toHaveBeenCalled();
});
