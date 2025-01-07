import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { app } from "../app";
import request from "supertest";

let mongo: any;

// setup a common mongo memory server for all test
beforeAll(async () => {
  process.env.JWT_KEY = "asdf";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

// delete data in mongo before each test
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// clean up
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// can choose to define as normal func export (authHelper.ts)
declare global {
  var signin: () => Promise<string[]>;
}

global.signin = async () => {
  const email = "abc@abc.com";
  const password = "password";
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: email,
      password: password,
    })
    .expect(201);
  return response.get("Set-Cookie") ?? [];
};
