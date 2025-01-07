import request from "supertest";
import { app } from "../../app";
import { signin } from "../../test/setup";
import mongoose from "mongoose";



async function createTicket() {
  return request(app)
    .post("/api/ticket")
    .set("Cookie", signin())
    .send({ title: "test", price: 5 });
}

it("can fetch a list of tickets", async () => {
  // create tickets
  await createTicket();
  await createTicket();
  await createTicket();

  const ticketsRes = await request(app).get(`/api/ticket/`).send().expect(200);
  expect(ticketsRes.body.length).toEqual(3);
});
