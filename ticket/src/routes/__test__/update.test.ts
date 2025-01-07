import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/setup";
import { Ticket } from "../../model/ticket";
import mongoose from "mongoose";
import { natsClient } from "../../nats-client";

const fakeId = new mongoose.Types.ObjectId().toHexString();

async function createTicket() {
  return request(app)
    .post("/api/ticket")
    .set("Cookie", signin())
    .send({ title: "test", price: 5 });
}

it("return 404 if provide id does not exist", async () => {
  await request(app).put(`/api/ticket/${fakeId}`).set("Cookie", signin()).send({
    title: "new",
    price: 10,
  });
  expect(404);
});

it("return 401 if user is not authenticated", async () => {
  const res = await createTicket();

  await request(app)
    .put(`/api/ticket/${res.body.id}`)
    .send({
      title: "new",
      price: 10,
    })
    .expect(401);
});

it("return 401 if user do not own the ticket", async () => {
  // create a ticket with default id
  const res = await createTicket();
  // actual edit request
  const updateRes = await request(app)
    .put(`/api/ticket/${res.body.id}`)
    // we use the same cookie, i.e. same user if don't make change to setup
    //.set("Cookie", signin())
    .set("Cookie", signin("test02"))
    .send({ title: "testtitle", price: 10 });

  //console.log(res.status);
  expect(updateRes.status).toEqual(401);
});

it("return 400 if user provide an invalid title or price", async () => {
  // create a ticket with default id
  const res = await createTicket();

  await request(app)
    .put(`/api/ticket/${res.body.id}`)
    .set("Cookie", signin())
    .send({ title: "", price: 10 })
    .expect(400);
  await request(app)
    .put(`/api/ticket/${res.body.id}`)
    .set("Cookie", signin())
    .send({ title: "new title", price: -10 })
    .expect(400);
});

it("update the ticket with valid input", async () => {
  const res = await createTicket();

  const updateRes = await request(app)
    .put(`/api/ticket/${res.body.id}`)
    .set("Cookie", signin())
    .send({ title: "new title", price: 999 })
    .expect(200);

  const ticketRes = await request(app)
    .get(`/api/ticket/${updateRes.body.id}`)
    .send();

  expect(ticketRes.body.title).toEqual("new title");
  expect(ticketRes.body.price).toEqual(999);
});

it("published an event", async () => {
  const res = await createTicket();

  await request(app)
    .put(`/api/ticket/${res.body.id}`)
    .set("Cookie", signin())
    .send({ title: "new title", price: 999 })
    .expect(200);

  expect(natsClient.client.publish).toHaveBeenCalled();
});
