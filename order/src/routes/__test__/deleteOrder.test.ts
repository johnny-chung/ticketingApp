import request from "supertest";
import { app } from "../../app";
import { signin, createTicket } from "../../test/setup";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../model/order";
import { natsClient } from "../../nats-client";

it("delete the order from user", async () => {
  const ticket = await createTicket();

  // create a new order again with the same ticket
  const orderRes = await request(app)
    .post("/api/order")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  const res = await request(app)
    .delete(`/api/order/${orderRes.body.id}`)
    .set("Cookie", signin())
    .send()
    .expect(204);
  // 204 mean no content

  const updateOrder = await Order.findById(orderRes.body.id);
  expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("published an event", async () => {
  const ticket = await createTicket();

  const order = Order.build({
    userId: "test",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket,
  });
  await order.save();

  // create a new order again with the same ticket
  const res = await request(app)
    .delete(`/api/order/${order.id}`)
    .set("Cookie", signin("test"))
    .send()
    .expect(204);

  expect(natsClient.client.publish).toHaveBeenCalled();
});
