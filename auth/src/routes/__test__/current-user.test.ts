import request from "supertest";
import { app } from "../../app";

it("should respond with details of current user", async () => {
  const cookie = await signup();

  const userResponse = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(userResponse.body.currentUser.email).toEqual("test@test.com");
});
