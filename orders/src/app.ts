import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUser, errorhandler, NotFoundError } from "@tjgittix/common";

const app = express();
app.set("trust proxy", true);
// middlewares
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

// routes

app.get("*", () => {
  throw new NotFoundError();
});

app.use(errorhandler);

export { app };
