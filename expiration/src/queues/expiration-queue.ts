// src/queues/expiration-queue.ts

import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsClient } from "../nats-client";

// step 1: optional -> interface
// optional but recommonded to add interface for the payload
interface Payload {
  orderId: string;
}

// step 2: create new instance of a queue

// Queue(<bucket-name>, opts-obj)
// bucket-name = our channel
const expirationQueue = new Queue<Payload>("order:expiration", {
  // use redis
  redis: {
    // from expiration-depl.yaml
    host: process.env.REDIS_HOST,
  },
});

// step 3: design how to handle the job

// data is store on job.data
expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsClient.client).publish({
    orderId: job.data.orderId,
  });
});

expirationQueue.on("error", (error) => {
  console.error(error);
});

export { expirationQueue };
