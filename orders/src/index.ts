import mongo from "mongoose";
import { app } from "./app";
import { stan } from "./events/nats-client";

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined!");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined!");
  if (!process.env.NATS_URL) throw new Error("NATS_URL must be defined!");
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error("NATS_CLUSTER_ID must be defined!");
  if (!process.env.NATS_CLIENT_ID)
    throw new Error("NATS_CLIENT_ID must be defined!");

  try {
    await stan.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    stan.client.on("close", () => {
      console.log("Closing NATS connection...");
      process.exit();
    });
    process.on("SIGINT", () => stan.client.close());
    process.on("SIGTERM", () => stan.client.close());

    await mongo.connect(process.env.MONGO_URI);
    console.log("Connected to db!");
  } catch (error) {
    console.log(error);
  }
};
start();

app.listen(3000, () => {
  console.log("Listing on port 3000!");
});
