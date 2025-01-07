import { requireAuth, validateRequest } from "@goodmanltd/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../model/ticket";
import { TicketCreatedPublisher } from "../events/publisher/ticket-created-publisher";
import { natsClient } from "../nats-client";

const router = express.Router();

// add requireAuth as this route need authentication
router.post(
  "/api/ticket",
  requireAuth,
  // express validator
  [
    body("title")
      .not() // title is not provided
      .isEmpty() // title is empty
      .withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 }) // is float and > 0
      .withMessage("Pirce must be greater than 0"),
  ],
  // the express validator will not throw an error, only include in the req body
  // need to deal with error/ throw the error on our own -> middleware we created earlier
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    console.log(`title: ${title} | price : ${price}`);

    // create ticket
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();

    // publish event to NATS Streaming
    await new TicketCreatedPublisher(natsClient.client).publish({
      id: ticket.id,
      title: ticket.title, // better use saved info from mongo
      price: ticket.price, // coz we may have custom logic that fmt the value
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
