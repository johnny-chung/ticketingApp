import request from "supertest";
import { app } from "../../app";

it("response with current user details if curruent user exist and signin", async () => {
  // change this to a helper func or global func in test
  //   const authRes = await request(app)
  //     .post("/api/users/signup")
  //     .send({
  //       email: "abc@abc.com",
  //       password: "password",
  //     })
  //     .expect(201);

  //   const cookie = authRes.get("Set-Cookie") ?? [];

  const cookie = await global.signin();
  console.log(cookie);
  // supertest is not going to manage cookie for us
  // cookie from first request is not pass to second request
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .expect(200);

  expect(response.body.currentUser.email).toEqual("abc@abc.com");

  console.log(response.body);
});

it("response with null if not authenticated", async () => {
  const response = await request(app).get("/api/users/currentuser").expect(200);

  expect(response.body.currentUser).toBeNull();
});
