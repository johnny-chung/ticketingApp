import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@goodmanltd/common";
import express, { NextFunction, Request, Response } from "express";
import { Order } from "../model/order";
import { body } from "express-validator";
import { OrderCreatedPublisher } from "../events/publisher/order-created-publisher";
import { natsClient } from "../nats-client";
import mongoose from "mongoose";
import { Ticket } from "../model/ticket";
import { addMinutes } from "date-fns";

const router = express.Router();

const EXPIRATION_MINS = 15;

router.post(
  `/api/order/`,
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      // optional -> check and see if provide id match mongoose id fmt
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("orderId is required"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // find the existing ticket from db
      const { ticketId } = req.body;
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) throw new NotFoundError();

      // ensure ticket is not being reserved
      //    find all order
      //    find ticket from all order
      //    if found and order not cancel -> reserved

      // extracted to ticket model
      // const existingOrder = await Order.findOne({
      //   ticket: ticket,
      //   status: {
      //     $in: [
      //       OrderStatus.Created,
      //       OrderStatus.AwaitingPayment,
      //       OrderStatus.Complete,
      //     ],
      //   },
      // });

      const isReserved = await ticket.isReserved();
      if (isReserved) throw new BadRequestError("Ticket is already reserved");

      // create new order
      const expiration = addMinutes(new Date(), EXPIRATION_MINS);

      const newOrder = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: ticket,
      });
      await newOrder.save();

      // publish order:created event to NATS Streaming
      await new OrderCreatedPublisher(natsClient.client).publish({
        id: newOrder.id,
        userId: newOrder.userId, // better use saved info from mongo
        status: newOrder.status, // coz we may have custom logic that fmt the value
        expiresAt: newOrder.expiresAt.toISOString(),
        ticket: {
          id: newOrder.ticket.id,
          price: newOrder.ticket.price,
        },
        version: newOrder.version,
      });

      res.status(201).send(newOrder);
    } catch (error) {
      next(error);
    }
  }
);

export { router as newOrderRouter };
