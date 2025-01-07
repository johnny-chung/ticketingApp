//listener.ts
import nats, { Message, Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log(`Listener connected to NATS`);

  stan.on("close", () => {
    console.log("NATS connection close");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

process.on("SIGINT", () => stan.close()); // for linux only
process.on("SIGTERM", () => stan.close()); // for linux only




//   const opts = stan
//     .subscriptionOptions()
//     .setManualAckMode(true)
//     .setDeliverAllAvailable()
//     .setDurableName("order-service");
//   const subscription = stan.subscribe(
//     "ticket:created",
//     "order-service-queue-qroup",
//     opts
//   );

//   subscription.on("message", (msg: Message) => {
//     const data = String(msg.getData());
//     console.log(`Received event # ${msg.getSequence()} | data: ${data}`);
//     msg.ack();
//   });
// });
