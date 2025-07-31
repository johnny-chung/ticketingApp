import {
  BadRequestError,
  NotAuthError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@goodmanltd/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../model/order";

const router = express.Router();

router.post(
  "/api/payment",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId, token } = req.body;
    try {
      // find the order
      const order = await Order.findById(orderId);
      if (!order) throw new NotFoundError();
      // check if the order belong to user
      if (order.userId != req.currentUser!.id) {
        throw new NotAuthError();
      }

      // check if order has been cancelled
      if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError("Order has been cancelled");
      }

      res.send({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

export { router as createChargeRouter };
