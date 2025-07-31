import request from "supertest";
import { app } from "../../app";
import { signin, createOrder } from "../../test/setup";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../model/order";
import { natsClient } from "../../nats-client";

const fakeOrderId = new mongoose.Types.ObjectId().toHexString();

describe.only("New charge Router", () => {
  it("return 404 if order is not found", async () => {
    await request(app)
      .post("/api/payment")
      .set("Cookie", signin())
      .send({ token: "abc", orderId: fakeOrderId })
      .expect(404);
  });
  it("return a 401 when purchase order does not belong to user", async () => {
    const order = await createOrder(fakeOrderId);

    await request(app)
      .post("/api/payment")
      .set("Cookie", signin("anotherUser"))
      .send({ token: "abc", orderId: order.id })
      .expect(401);
  });
  it("return 400 when purchase a cancelled order", async () => {
    const order = await createOrder(
      fakeOrderId,
      "test01",
      OrderStatus.Cancelled
    );
    await request(app)
      .post("/api/payment")
      .set("Cookie", signin("test01"))
      .send({ token: "abc", orderId: order.id })
      .expect(400);
  });
});
