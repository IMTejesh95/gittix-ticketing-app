import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUser, errorhandler, NotFoundError } from "@tjgittix/common";
import { createTicketRouter } from "./routes/create";
import { readTicketRouter } from "./routes/read";
import { listTicketsRouter } from "./routes/list";
import { updateTicketRouter } from "./routes/update";

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
app.use(createTicketRouter);
app.use(readTicketRouter);
app.use(listTicketsRouter);
app.use(updateTicketRouter);

app.get("*", () => {
  throw new NotFoundError();
});

app.use(errorhandler);

export { app };
