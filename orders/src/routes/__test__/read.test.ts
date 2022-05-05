import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("returns order with embedded ticket for order Id", async () => {
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
    .get(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(resp.body.ticket.id).toBe(ticket.id);
  expect(resp.body.id).toBe(order.id);
});
