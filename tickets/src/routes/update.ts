import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@tjgittix/common";
import { Request, Response, Router } from "express";
import { body } from "express-validator";
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
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body);

    if (!ticket) throw new NotFoundError();
    if (ticket && ticket.userId !== req.currentUser?.id)
      throw new NotAuthorizedError();

    res.sendStatus(200);
  }
);

export { router as updateTicketRouter };
