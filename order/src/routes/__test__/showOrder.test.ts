import request from "supertest";
import { app } from "../../app";
import { signin, createTicket } from "../../test/setup";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../model/order";

it("return the order from user", async () => {
  const ticket = await createTicket();

  // create a new order again with the same ticket
  const orderRes = await request(app)
    .post("/api/order")
    .set("Cookie", signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  const res = await request(app)
    .get(`/api/order/${orderRes.body.id}`)
    .set("Cookie", signin())
    .send()
    .expect(200);
  expect(res.body.id).toEqual(orderRes.body.id);
});
