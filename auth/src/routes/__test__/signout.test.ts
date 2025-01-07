import request from "supertest";
import { app } from "../../app";

it("cookie should be clear after signout", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "abc@abc.com",
      password: "password",
    })
    .expect(201);
  let response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "abc@abc.com",
      password: "password",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();

  response = await request(app).post("/api/users/signout").send({}).expect(200);

  //console.log(response.get("Set-Cookie"));
  expect(response.get("Set-Cookie")).toBeDefined();
  expect(response.get('Set-Cookie')?.[0]).toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly')
});
