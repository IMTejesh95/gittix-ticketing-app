import request from "supertest";
import { app } from "../../app";
import { stan } from "../../events/nats-client";

it("should return 404 if ticket with supplied id does not exists", async () => {
  await request(app)
    .put(`/api/tickets/${generateMongoId()}`)
    .set("Cookie", signup())
    .send({
      title: "Ticket",
      price: 23,
    })
    .expect(404);
});

it("should return 401 if user not authenticated", async () => {
  await request(app)
    .put(`/api/tickets/${generateMongoId()}`)
    .send({
      title: "Ticket",
      price: 20,
    })
    .expect(401);
});

it("should return 401 if user is not a ticket owner", async () => {
  const resp = await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({
      title: "Ticket",
      price: 23,
    });

  await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set("Cookie", signup())
    .send({
      title: "Ticket",
      price: 24,
    })
    .expect(401);
});

it("should return 400 if user provides invalid title or price", async () => {
  await request(app)
    .put(`/api/tickets/${generateMongoId()}`)
    .set("Cookie", signup())
    .send({
      price: 23,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${generateMongoId()}`)
    .set("Cookie", signup())
    .send({
      title: "",
      price: 23,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${generateMongoId()}`)
    .set("Cookie", signup())
    .send({
      title: "Test Ticket",
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${generateMongoId()}`)
    .set("Cookie", signup())
    .send({
      title: "Test Ticket",
      price: -1,
    })
    .expect(400);
});

it("should return 200 after successful update", async () => {
  const cookie = signup();
  const resp = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Ticket",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Test Ticket",
      price: 24,
    })
    .expect(200);

  const getResp = await request(app)
    .get(`/api/tickets/${resp.body.id}`)
    .send()
    .expect(200);

  expect(getResp.body.title).toEqual("Test Ticket");
  expect(getResp.body.price).toEqual(24);
});


it("publishes an event", async () => {
  const cookie = signup();
  const resp = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Ticket",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Test Ticket",
      price: 24,
    })
    .expect(200);

  const getResp = await request(app)
    .get(`/api/tickets/${resp.body.id}`)
    .send()
    .expect(200);

  expect(stan.client.publish).toHaveBeenCalled();
});
