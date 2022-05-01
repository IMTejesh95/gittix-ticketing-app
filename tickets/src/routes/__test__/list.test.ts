import request from "supertest";
import { app } from "../../app";

async function createTicket(title: string) {
  await request(app).post("/api/tickets").set("Cookie", signup()).send({
    title,
    price: 15.5,
  });
}

it("lists tickets", async () => {
  for (let i = 1; i < 5; i++) {
    await createTicket(`Ticket ${i}`);
  }

  const resp = await request(app).get("/api/tickets").send().expect(200);

  expect(resp.body.length).toEqual(4);
});
