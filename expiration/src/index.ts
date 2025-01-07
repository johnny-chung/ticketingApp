import { natsClient } from "./nats-client";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

async function connectNats() {
  try {
    //await natsClient.connect("ticketing", "random", "http://nats-srv:4222");
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

    new OrderCreatedListener(natsClient.client).listen();
  } catch (error) {
    console.error(error);
  }
}

connectNats();
