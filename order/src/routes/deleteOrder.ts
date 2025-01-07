import {
  NotAuthError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@goodmanltd/common";
import express, { NextFunction, Request, Response } from "express";
import { Order } from "../model/order";
import { OrderCancelledPublisher } from "../events/publisher/order-cancelled-publisher";
import { natsClient } from "../nats-client";

const router = express.Router();

router.delete(
  `/api/order/:orderId`,
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await Order.findById(req.params.orderId);

      if (!order) {
        throw new NotFoundError(); // Will be caught by error middleware
      }

      if (order.userId != req.currentUser!.id) {
        throw new NotAuthError();
      }

      order.status = OrderStatus.Cancelled;
      await order.save();

      // publish a order:cancel event
      await new OrderCancelledPublisher(natsClient.client).publish({
        id: order.id,
        status: order.status,
        ticket: {
          id: order.ticket.id,
          price: order.ticket.price,
        },
        version: order.version,
      });

      res.status(204).send();
    } catch (err) {
      next(err); // Pass the error to the next middleware (i.e., the error handler)
    }
  }
);

export { router as deleteOrderRouter };
