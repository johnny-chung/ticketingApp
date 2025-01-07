import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
let mongo: any;

// mock nats-client
jest.mock("../nats-client");

// setup a common mongo memory server for all test
beforeAll(async () => {
  // clear mock
  jest.clearAllMocks();
  process.env.JWT_KEY = "asdf";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

// delete data in mongo before each test
beforeEach(async () => {
  if (mongoose.connection.db) {
    // Check if connected
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  } else {
    throw new Error("Database connection is not established");
  }
});

// clean up
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// this only works on auth service
// don't want to make test across service

// can choose to define as normal func export (authHelper.ts)
// declare global {
//   var signin: () => Promise<string[]>;
// }

// global.signin = async () => {
//   const email = "abc@abc.com";
//   const password = "password";
//   const response = await request(app)
//     .post("/api/users/signup")
//     .send({
//       email: email,
//       password: password,
//     })
//     .expect(201);
//   return response.get("Set-Cookie") ?? [];
// };

export function signin(id: string = "test01") {
  // build a jwt payload: {id, email}
  const payload = { id: id, email: "test@test.com" };

  // create jwt => jwt sign
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build session obj: {jwt: <value>}
  const session = { jwt: token };

  // turn session obj into JSON
  const sessionJSON = JSON.stringify(session);

  // encode JSON into base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string: the cookie with encoded data
  return [`session=${base64}`];
}
