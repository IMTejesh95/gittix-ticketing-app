import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import request from "supertest";
import { app } from "../../app";

it("list orders for authenticated user", async () => {
  const cookie = signup();
  const tickets = await Ticket.insertMany([
    {
      id: generateMongoId(),
      title: "ticket 1",
      price: 10,
    },
    {
      id: generateMongoId(),
      title: "ticket 2",
      price: 20,
    },
  ]);

  for (let tkt of tickets) {
    await request(app).post("/api/orders").set("Cookie", cookie).send({
      ticketId: tkt.id,
    });
  }

  const resp = await request(app)
    .get("/api/orders")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(resp.body.length).toBe(2);
});
