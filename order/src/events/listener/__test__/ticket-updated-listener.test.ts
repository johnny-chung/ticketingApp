import { TicketCreatedEvent, TicketUpdatedEvent } from "@goodmanltd/common";
import { natsClient } from "../../../nats-client";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../model/ticket";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const fakeId = new mongoose.Types.ObjectId().toHexString();

async function setUp() {
  // create an instance of listener
  const listener = new TicketUpdatedListener(natsClient.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: fakeId,
    title: "test ticket",
    price: 1,
  });
  await ticket.save();

  // create a fake data event/ an obj
  const data: TicketUpdatedEvent["data"] = {
    id: fakeId,
    version: ticket.version + 1,
    title: "Amended",
    price: 999,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // a fake msg obj
  //@ts-ignore
  const msg: Message = {
    // mock the ack method
    ack: jest.fn(),
  };
  return { listener, ticket, data, msg };
}

it("finds, update and save the ticket", async () => {
  const { listener, ticket: orgTicket, data, msg } = await setUp();
  // call onMessage
  await listener.onMessage(data, msg);

  // ensure ticket has been update
  const updatedTicket = await Ticket.findById(fakeId);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("ack the message", async () => {
  const { listener, data, msg } = await setUp();

  // call onMessage
  await listener.onMessage(data, msg);
  // ensure ack is called
  expect(msg.ack).toHaveBeenCalled();
});

it("do not process of order update event", async () => {
  const { listener, data, msg } = await setUp();
  // call onMessage

  await expect(
    listener.onMessage({ ...data, version: data.version + 1 }, msg)
  ).rejects.toThrow();

  // ensure ack is not called
  expect(msg.ack).not.toHaveBeenCalled();
});
