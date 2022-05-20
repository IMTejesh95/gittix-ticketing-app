import mongo from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("@gittix/auth starting up...");
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined!");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined!");

  try {
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
