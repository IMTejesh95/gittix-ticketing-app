import { OrderCreatedEvent, OrderStatus } from "@tjgittix/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { stan } from "../../nats-client";
import { OrderCreatedListner } from "../order-created-listner";

async function setup() {
  const listner = new OrderCreatedListner(stan.client);

  const ticket = Ticket.build({
    title: "test ticket",
    price: 13,
    userId: generateMongoId(),
  });
  await ticket.save();

  const eventData: OrderCreatedEvent["data"] = {
    id: generateMongoId(),
    status: OrderStatus.Created,
    userId: generateMongoId(),
    expiresAt: new Date().toISOString(),
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listner, eventData, ticket, msg };
}

it("associates orderId with ticket to reserve it successfully", async () => {
  const { listner, eventData, ticket, msg } = await setup();

  await listner.onMessage(eventData, msg);

  const reservedTicket = await Ticket.findById(ticket.id);

  expect(reservedTicket!.orderId).toBe(eventData.id);
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes ticket:updated event", async () => {
  const { listner, eventData, ticket, msg } = await setup();

  await listner.onMessage(eventData, msg);

  const tktUpdtedEventData = JSON.parse(
    (stan.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(stan.client.publish).toHaveBeenCalled();
  expect(eventData.id).toBe(tktUpdtedEventData.orderId);
});
