import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

// create an abstract class for listener
export abstract class Listener<T extends Event> {
  // the client/ listener by NATS
  // protected -> child class can access but not outsider
  protected client: Stan;

  // the topic/ channel name
  abstract subject: T["subject"];
  // usually the service name
  abstract queueGroupName: string;
  // the actual business logic to handle the data
  abstract onMessage(data: T["data"], msg: Message): void;
  // timeout in second that the NATS consider a msg fail to delivered
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOpts() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDeliverAllAvailable()
      .setDurableName(this.queueGroupName);
  }
  // method to listen to the subscription and call onMessage()
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOpts()
    );
    subscription.on("message", (msg: Message) => {
      console.log(`Message recieved: ${this.subject} | ${this.queueGroupName}`);
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }
  // helper function
  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}
