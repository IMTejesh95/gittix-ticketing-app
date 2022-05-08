import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";

declare global {
  function signup(id?: string): string[];
  function generateMongoId(): string;
}

jest.mock("../events/nats-client.ts");

let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = "testkey";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

global.signup = (id?: string) => {
  const payload = {
    id: id || generateMongoId(), //"du92j3nd9e8n",
    email: "test@test.com",
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const encodedSession = Buffer.from(sessionJSON).toString("base64");

  return [`session=${encodedSession}`];
};

global.generateMongoId = () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  return id;
};
