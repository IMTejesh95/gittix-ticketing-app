import { randomBytes } from "crypto";
import nats, { Message, Stan } from "node-nats-streaming";
import { TicketCreatedListner } from "./events/ticket-created-listner";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.clear();
  console.log("Subscriber/Listner connected to NATS!");

  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  new TicketCreatedListner(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());

abstract class Listner {
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, message: Message): void;

  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionsOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionsOptions()
    );

    subscription.on("message", (message: Message) => {
      console.log(`Message recieved: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMesaage(message);
      this.onMessage(parsedData, message);
    });
  }

  parseMesaage(message: Message) {
    const data = message.getData();

    return typeof data == "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf-8"));
  }
}
