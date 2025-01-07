import {
  BadRequestError,
  NotAuthError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@goodmanltd/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../model/ticket";
import { natsClient } from "../nats-client";
import { TicketUpdatedPublisher } from "../events/publisher/ticket-updated-publisher";

const router = express.Router();

router.put(
  `/api/ticket/:id`,
  requireAuth,
  [
    body("title")
      .not() // title is not provided
      .isEmpty() // title is empty
      .withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 }) // is float and > 0
      .withMessage("Pirce must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) {
        throw new NotFoundError(); // Will be caught by error middleware
      }
      if (ticket.userId != req.currentUser!.id) {
        throw new NotAuthError();
      }

      if (ticket.orderId) {
        throw new BadRequestError("Tickets has been reserved");
      }

      // udpate => use set
      ticket.set({
        title: req.body.title,
        price: req.body.price,
      });
      await ticket.save(); // also update the local 'ticket'

      // publish msg to NATS
      new TicketUpdatedPublisher(natsClient.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
      });

      res.send(ticket); // can send back right away
    } catch (err) {
      next(err); // Pass the error to the next middleware (i.e., the error handler)
    }
  }
);

export { router as updateTicketRouter };
