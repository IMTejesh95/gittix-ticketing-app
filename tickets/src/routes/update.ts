import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@tjgittix/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { stan } from "../events/nats-client";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { Ticket } from "../models/ticket";

const router = Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Invalid title"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than zero"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) throw new NotFoundError();

    if (ticket && ticket.userId !== req.currentUser?.id)
      throw new NotAuthorizedError();

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();

    await new TicketUpdatedPublisher(stan.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
