// index.ts

import { app } from "./app";
import mongoose from "mongoose";
import { natsClient } from "./nats-client";
import { TicketCreatedListener } from "./events/listener/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listener/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listener/expiration-complete-listener";
import { PaymentIntentCreatedListener } from "./events/listener/paymentIntent-created-listener";

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
    new TicketCreatedListener(natsClient.client).listen();
    new TicketUpdatedListener(natsClient.client).listen();
    new ExpirationCompleteListener(natsClient.client).listen();
    new PaymentIntentCreatedListener(natsClient.client).listen();
    
  } catch (error) {
    console.error(error);
  }
}

app.listen(3000, () => {
  console.log("Order Service listening on port 3000");
});

connectMongo();
connectNats();
