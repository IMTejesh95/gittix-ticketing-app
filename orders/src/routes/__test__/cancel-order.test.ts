import { OrderStatus } from "@tjgittix/common";
import request from "supertest";
import { app } from "../../app";
import { stan } from "../../events/nats-client";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";

it("cancels order for provided order id", async () => {
  const cookie = signup();
  const ticket = Ticket.build({
    title: "Test Ticket",
    price: 10,
  });
  await ticket.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  const patchedOrder = await Order.findById(order.id);

  expect(patchedOrder!.status).toBe(OrderStatus.Cancelled);
});

it("emits order cancelled event", async () => {
  const cookie = signup();
  const ticket = Ticket.build({
    title: "Test Ticket",
    price: 10,
  });
  await ticket.save();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const resp = await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(stan.client.publish).toHaveBeenCalled();
});
