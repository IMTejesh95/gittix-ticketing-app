import request from "supertest";
import { app } from "../../app";
import { TicketDoc } from "../../models/ticket";
import mongo from "mongoose";

it("returns 404 if ticket not found", async () => {
  const id = new mongo.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns ticket if found", async () => {
  const resp = await request(app)
    .post("/api/tickets")
    .set("Cookie", signup())
    .send({
      title: "Test Title",
      price: 10,
    })
    .expect(201);

  const tktResp = await request(app)
    .get(`/api/tickets/${resp.body.id}`)
    .send()
    .expect(200);

  const tkt: TicketDoc = tktResp.body;
  expect(tkt.title).toEqual("Test Title");
  expect(tkt.price).toEqual(10);
});
