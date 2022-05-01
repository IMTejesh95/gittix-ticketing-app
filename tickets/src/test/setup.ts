import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";

declare global {
  function signin(): Promise<string[]>;
  function signup(): string[];
}

let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = "testkey";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

global.signin = async (): Promise<string[]> => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");
  return cookie;
};

global.signup = () => {
  const payload = {
    id: "du92j3nd9e8n",
    email: "test@test.com",
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const encodedSession = Buffer.from(sessionJSON).toString("base64");

  return [`session=${encodedSession}`];
};
