import { TicketCreatedEvent } from "@tjgittix/common";
import nats, { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { stan } from "../../nats-client";
import { TicketCreatedListner } from "../ticket-created-listner";

async function setup() {
  const listner = new TicketCreatedListner(stan.client);

  const eventData: TicketCreatedEvent["data"] = {
    id: generateMongoId(),
    title: "test ticket",
    price: 31,
    version: 0,
    userId: generateMongoId(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listner, eventData, msg };
}

it("creates and saves a ticket", async () => {
  const { listner, eventData, msg } = await setup();

  await listner.onMessage(eventData, msg);

  const ticket = await Ticket.findById(eventData.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toBe(eventData.title);
  expect(ticket!.price).toBe(eventData.price);
});

it("acknowledges the message", async () => {
  const { listner, eventData, msg } = await setup();

  await listner.onMessage(eventData, msg);

  expect(msg.ack).toHaveBeenCalled();
});
