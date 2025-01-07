import { NotAuthError, NotFoundError, requireAuth } from "@goodmanltd/common";
import express, { NextFunction, Request, Response } from "express";
import { Order } from "../model/order";

const router = express.Router();

router.get(
  `/api/order/:orderId`,
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await Order.findById(req.params.orderId).populate("ticket");

      if (!order) {
        throw new NotFoundError(); // Will be caught by error middleware
      }

      if (order.userId != req.currentUser!.id) {
        throw new NotAuthError();
      }

      res.send(order);
    } catch (err) {
      next(err); // Pass the error to the next middleware (i.e., the error handler)
    }
  }
);

export { router as showOrderRouter };
