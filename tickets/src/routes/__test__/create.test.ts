import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { stan } from "../../events/nats-client";

it("has a route listing to /api/tickets for post", async () => {
  const resp = await request(app).post("/api/tickets").send({});
  expect(resp.status).not.toEqual(404);
});

it("can only be accessed if user is authenticated", async () => {
  const resp = await request(app).post("/api/tickets").send({});
  expect(resp.status).toEqual(401);
});

it("checks if user is signed in and returns status other than 401", async () => {
  const resp = await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({});
  expect(resp.status).not.toEqual(401);
});

it("error if invalid title", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({
      price: 10,
    })
    .expect(400);
});

it("error if invalid price", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({
      title: "Test Ticket",
      price: -1,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({
      title: "Test Ticket",
    })
    .expect(400);
});

it("creates a ticket eith valid input data", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({
      title: "Test Title",
      price: 10,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(10);
});


it("publishes an event", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({
      title: "Test Title",
      price: 10,
    })
    .expect(201);

  expect(stan.client.publish).toHaveBeenCalled();
});