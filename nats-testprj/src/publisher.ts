//publisher.ts
import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();
//people like to call client a 'stan'
const client = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

//can't was async await syntax -> need to listen to event => client.on
// on successful -> will emit a 'connect' event
client.on("connect", async () => {
  console.log(`Publisher connected to NATS`);

  const publisher = new TicketCreatedPublisher(client);
  try {
    await publisher.publish({
      id: "123",
      title: "concert",
      price: 20,
    });
  } catch (error) {
    console.error(error);
  }

  //NATS streaming server only accept plan/ raw data = string
  // const event = JSON.stringify({
  //   id: "123",
  //   title: "concert",
  //   price: 20,
  // });

  // client.publish("ticket:created", event, () => {
  //   console.log("event publish");
  // });
});
