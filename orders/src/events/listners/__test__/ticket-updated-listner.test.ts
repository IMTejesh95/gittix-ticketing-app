import { TicketUpdatedEvent } from "@tjgittix/common";
import { Ticket } from "../../../models/ticket";
import { stan } from "../../nats-client";
import { TicketUpdatedListner } from "../ticket-updated-listner";

async function setup() {
  const listner = new TicketUpdatedListner(stan.client);

  const ticket = Ticket.build({
    id: generateMongoId(),
    title: "test ticket",
    price: 21,
  });
  await ticket.save();

  const eventData: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    title: "test ticket updated",
    price: 31,
    version: 1,
    userId: generateMongoId(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listner, eventData, msg };
}

it("fetches, updates and saves a ticket", async () => {
  const { listner, eventData, msg } = await setup();

  await listner.onMessage(eventData, msg);

  const ticket = await Ticket.findById(eventData.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toBe(eventData.title);
  expect(ticket!.version).toBe(eventData.version);
  expect(msg.ack).toHaveBeenCalled();
});

it("not acknowledges the message", async () => {
  const { listner, eventData, msg } = await setup();
  eventData.version = 12;

  await expect(listner.onMessage(eventData, msg)).rejects.toThrowError();

  expect(msg.ack).not.toHaveBeenCalled();
});
