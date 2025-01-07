import request from "supertest";
import { app } from "../../app";
import { signin, createOrder } from "../../test/setup";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../model/order";
import { natsClient } from "../../nats-client";
import { stripe } from "../../stripe";
jest.mock("../../stripe");

const fakeOrderId = new mongoose.Types.ObjectId().toHexString();

describe.only("New paymentintent Router", () => {
  it("return 404 if order is not found", async () => {
    await request(app)
      .post("/api/payment")
      .set("Cookie", signin())
      .send({ orderId: fakeOrderId })
      .expect(404);
  });
  it("return a 401 when purchase order does not belong to user", async () => {
    const order = await createOrder(fakeOrderId);

    await request(app)
      .post("/api/payment")
      .set("Cookie", signin("anotherUser"))
      .send({ orderId: order.id })
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
      .send({ orderId: order.id })
      .expect(400);
  });
  it("return a stripe client secret with valid input", async () => {
    const order = await createOrder(fakeOrderId, "test01", OrderStatus.Created);
    const stripeRes = await request(app)
      .post("/api/payment")
      .set("Cookie", signin("test01"))
      .send({ orderId: order.id })
      .expect(201);
    const paymentIntent = (stripe.paymentIntents.create as jest.Mock).mock
      .calls[0][0];
    expect(paymentIntent.amount).toEqual(order.price * 100);
    expect(stripeRes.body.client_secret).toEqual("mock-stripe-client-secret");
  });
});
