// index.ts

import { app } from "./app";
import mongoose from "mongoose";
import { natsClient } from "./nats-client";
import { OrderCreatedListener } from "./event/listeners/order-created-listener";
import { OrderCancelledListener } from "./event/listeners/order-cancelled-listener";

async function connectMongo() {
  try {
    // check env in first run
    if (!process.env.JWT_KEY) {
      throw new Error("JWT key not define");
    }
    if (!process.env.MONGO_URI) {
      throw new Error("Mongo uri not define");
      // read mongo url from env
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

async function connectNats() {
  try {
    if (!process.env.NATS_URL) {
      throw new Error("NATS_URL not define");
    }
    if (!process.env.NATS_CLUSTER_ID) {
      throw new Error("NATS_CLUSTER_ID not define");
    }
    if (!process.env.NATS_CLIENT_ID) {
      throw new Error("NATS_CLIENT_ID not define");
    }

    await natsClient.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsClient.client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => natsClient.client.close());
    process.on("SIGTERM", () => natsClient.client.close());

    // create listener
    new OrderCreatedListener(natsClient.client).listen();
    new OrderCancelledListener(natsClient.client).listen();
  } catch (error) {
    console.error(error);
  }
}

app.listen(3000, () => {
  console.log("Payment Service listening on port 3000");
});

connectMongo();
connectNats();
