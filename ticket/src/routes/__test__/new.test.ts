import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/setup";
import { Ticket } from "../../model/ticket";
// by creating __mocks__/nats-client -> jest will import the mock one instead
// don't need to import from mock on our own
import { natsClient } from "../../nats-client";

it("has a route handler listen to /api/ticket for post requests", async () => {
  const res = await request(app).post("/api/ticket").send({});
  expect(res.status).not.toEqual(404);
});

it("only be access if signin", async () => {
  await request(app).post("/api/ticket").send({}).expect(401);
});
it("return status other than 401 if use is signin", async () => {
  const res = await request(app)
    .post("/api/ticket")
    .set("Cookie", signin())
    .send({});
  //console.log(res.status);
  expect(res.status).not.toEqual(401);
});

it("return error if invalid title provided", async () => {
  await request(app)
    .post("/api/ticket")
    .set("Cookie", signin())
    .send({ title: "", price: 10 })
    .expect(400);
});

it("return error if invalid price provided", async () => {
  await request(app)
    .post("/api/ticket")
    .set("Cookie", signin())
    .send({ title: "test", price: -10 })
    .expect(400);
});

it("create ticket if input is valid", async () => {
  const title = "test";

  // check to make sure ticket is saved in db
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/ticket")
    .set("Cookie", signin())
    .send({ title: title, price: 10 })
    .expect(201);

  tickets = await Ticket.find({});

  expect(tickets[0].title).toEqual(title);
});

it("published an event", async () => {
  await request(app)
    .post("/api/ticket")
    .set("Cookie", signin())
    .send({ title: "test", price: 10 })
    .expect(201);

  //console.log(natsClient);

  expect(natsClient.client.publish).toHaveBeenCalled();
});
