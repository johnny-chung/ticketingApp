import { NotFoundError } from "@goodmanltd/common";
import express, { NextFunction, Request, Response } from "express";
import { Ticket } from "../model/ticket";

const router = express.Router();



router.get(
  `/api/ticket/`,
  async (req: Request, res: Response, next: NextFunction) => {
    const tickets = await Ticket.find({});
    res.send(tickets);
  }
);

export { router as indexTicketRouter };
