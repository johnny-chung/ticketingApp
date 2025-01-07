//__test__/signup.test.ts
import request from "supertest";
import { app } from "../../app";

it("return status 201 on successfull signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "abc@abc.com",
      password: "password",
    })
    .expect(201);
});

it("return status 400 with invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "abc",
      password: "password",
    })
    .expect(400);
});

it("return status 400 with invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "abc@abc.com",
      password: "123",
    })
    .expect(400);
});

it("return status 400 with empty email or password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      password: "abcdefg",
    })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "abc@abc.com",
    })
    .expect(400);
});

it("disallow duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "abc@abc.com",
      password: "password",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "abc@abc.com",
      password: "password",
    })
    .expect(400);
});
// cookieSession: secure: true -> only share cookie over https
// supertest -> http -> no cookie
// change secure: process.env.NODE_ENV !== "test" -> jest will include this env 
it("set a cookie after successfully signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "abc@abc.com",
      password: "password",
    })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
});
