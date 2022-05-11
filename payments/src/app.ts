import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUser, errorhandler, NotFoundError } from "@tjgittix/common";
import { createPaymentSessionRouter } from "./routes/create";
import { paymentSuccessCallbackRouter } from "./routes/success";
import { deletePaymentRouter } from "./routes/delete";

const app = express();
app.set("trust proxy", true);

// middlewares attach
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

// routes
app.use(createPaymentSessionRouter);
app.use(paymentSuccessCallbackRouter);
app.use(deletePaymentRouter);

app.get("*", () => {
  throw new NotFoundError();
});

app.use(errorhandler);

export { app };
