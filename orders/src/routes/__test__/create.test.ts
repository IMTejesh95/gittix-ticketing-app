import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";

it("returns 404 if ticket does not exist", async () => {
  await request(app)
    .post("/api/orders")
    .set("Cookie", signup())
    .send({
      ticketId: generateMongoId(),
    })
    .expect(404);
});

it("returns 400 if ticket already reserved", async () => {
  const ticket = Ticket.build({
    title: "Test Ticket",
    price: 10,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "dd9jndj09wd98n",
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signup())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("returns 201 if ticket reserved success", async () => {
  const ticket = Ticket.build({
    title: "Test Ticket",
    price: 10,
  });
  await ticket.save();

  const resp = await request(app)
    .post("/api/orders")
    .set("Cookie", signup())
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  expect(resp.body.ticket.id).toBe(ticket.id);
  expect(resp.body.status).toBe(OrderStatus.Created);
});

it.todo("emits an order created event");
