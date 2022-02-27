import mongo from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined!");

  try {
    await mongo.connect("mongodb://auth-mongo-svc:27017/auth");
    console.log("Connected to auth-mongo db!");
  } catch (error) {
    console.log(error);
  }
};
start();

app.listen(3000, () => {
  console.log("Listing on port 3000!");
});
