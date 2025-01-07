import request from "supertest";
import { app } from "../../app";

it("return 400 if user does not exist signin", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "abc@abc.com",
      password: "password",
    })
    .expect(400);
});

it("fail when password is incorrect", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "abc@abc.com",
      password: "password",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "abc@abc.com",
      password: "123",
    })
    .expect(400);
});

it("recieve cookie on successfull signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "abc@abc.com",
      password: "password",
    })
    .expect(201);
  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "abc@abc.com",
      password: "password",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
