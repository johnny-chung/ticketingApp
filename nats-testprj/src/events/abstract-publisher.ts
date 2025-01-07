//abstract-publisher.ts

import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  private client: Stan;

  abstract subject: T["subject"];

  constructor(client: Stan) {
    this.client = client;
  }

  // make publish an async await func -> return a Promise
  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log(`Event published to ${this.subject}`);
        resolve();
      });
    });
  }
}
