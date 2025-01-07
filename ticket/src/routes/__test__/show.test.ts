import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/setup";
import mongoose from "mongoose";



it("return 404 if ticket not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/ticket/${id}`).send().expect(404);
}, 10000);

it("return the ticket if found", async () => {
  // better way is to build the ticket directly -> Ticket.build -> ticket.save
  const title = "test";
  const price = 20;
  // we are more like testing different route at the same time
  const res = await request(app)
    .post("/api/ticket")
    .set("Cookie", signin())
    .send({ title: title, price: price })
    .expect(201);

  const ticketRes = await request(app)
    .get(`/api/ticket/${res.body.id}`)
    .send()
    .expect(200);

  expect(ticketRes.body.title).toEqual(title);
  expect(ticketRes.body.price).toEqual(price);
});
