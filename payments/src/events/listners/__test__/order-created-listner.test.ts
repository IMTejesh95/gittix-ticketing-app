import { OrderCreatedEvent, OrderStatus } from "@tjgittix/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { stan } from "../../nats-client";
import { OrderCreatedListner } from "../order-created-listner";

async function setup() {
  const listner = new OrderCreatedListner(stan.client);

  const data: OrderCreatedEvent["data"] = {
    id: generateMongoId(),
    version: 0,
    userId: generateMongoId(),
    expiresAt: new Date().toISOString(),
    status: OrderStatus.Created,
    ticket: {
      id: generateMongoId(),
      price: 75,
    },
  };

  /// @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listner, data, msg };
}

it("builds and saves order using event data", async () => {
  const { listner, data, msg } = await setup();

  await listner.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order).toBeDefined();
  expect(order!.price).toBe(data.ticket.price);
  expect(msg.ack).toHaveBeenCalled();
});
