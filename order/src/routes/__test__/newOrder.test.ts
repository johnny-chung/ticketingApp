import request from "supertest";
import { app } from "../../app";
import { signin, createTicket } from "../../test/setup";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../model/order";
import { natsClient } from "../../nats-client";

it("return error if ticket not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post("/api/order")
    .set("Cookie", signin())
    .send({ ticketId: ticketId })
    .expect(404);
});

it("return error if ticket is reserved", async () => {
  const ticket = await createTicket();

  // create an existing order with the ticket
  const order = Order.build({
    userId: "abc",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  // create a new order again with the same ticket
  await request(app)
    .post("/api/order")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserved a ticket and create new order", async () => {
  const ticket = await createTicket();
  // create a new order again with the same ticket
  await request(app)
    .post("/api/order")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("published an event", async () => {
  const ticket = await createTicket();
  // create a new order again with the same ticket
  await request(app)
    .post("/api/order")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsClient.client.publish).toHaveBeenCalled();
});
