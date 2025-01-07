import { NotFoundError } from "@goodmanltd/common";
import express, { NextFunction, Request, Response } from "express";
import { Ticket } from "../model/ticket";

const router = express.Router();

router.get(
  `/api/ticket/:id`,
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("get ticket: ", req.params.id);
    try {
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) {
        throw new NotFoundError(); // Will be caught by error middleware
      }
      res.send(ticket);
    } catch (err) {
      next(err); // Pass the error to the next middleware (i.e., the error handler)
    }
  }
);

export { router as showTicketRouter };
