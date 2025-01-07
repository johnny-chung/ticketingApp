import request from "supertest";
import { app } from "../../app";
import { signin, createTicket } from "../../test/setup";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../model/order";

it("return the orders from user", async () => {
  const ticket = await createTicket();

  const ticket2 = await createTicket(
    new mongoose.Types.ObjectId().toHexString(),
    "ticket2",
    10
  );

  const order2 = await Order.build({
    userId: "user02",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket2,
  });

  // create a new order again with the same ticket
  await request(app)
    .post("/api/order")
    .set("Cookie", signin("user01"))
    .send({ ticketId: ticket.id })
    .expect(201);

  const res = await request(app)
    .get("/api/order")
    .set("Cookie", signin("user01"))
    .send({ ticketId: ticket.id })
    .expect(200);

  expect(res.body.length).toEqual(1);
});
