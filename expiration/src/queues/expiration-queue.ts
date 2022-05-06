import Queue from "bull";
import { stan } from "../events/nats-client";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";

interface JobPayload {
  orderId: string;
}

const expirationQueue = new Queue<JobPayload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async ({ data: { orderId } }) => {
  await new ExpirationCompletePublisher(stan.client).publish({
    orderId,
  });
});

export { expirationQueue };
