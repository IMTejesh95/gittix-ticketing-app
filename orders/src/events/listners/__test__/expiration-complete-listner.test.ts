import { ExpirationCompleteEvent, OrderStatus } from "@tjgittix/common";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { stan } from "../../nats-client";
import { ExpirationCompleteListner } from "../expiration-complete-listner";

async function setup() {
  const listner = new ExpirationCompleteListner(stan.client);

  const ticket = Ticket.build({
    id: generateMongoId(),
    title: "test ticket",
    price: 34,
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    expiresAt: new Date(),
    userId: generateMongoId(),
    ticket,
  });
  await order.save();

  const eventData: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listner, eventData, msg };
}

it("cancels order if purchasing window expired", async () => {
  const { listner, eventData, msg } = await setup();

  await listner.onMessage(eventData, msg);

  const updatedOrder = await Order.findById(eventData.orderId);

  expect(updatedOrder!.status).toBe(OrderStatus.Cancelled);
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes order cancelled event", async () => {});
