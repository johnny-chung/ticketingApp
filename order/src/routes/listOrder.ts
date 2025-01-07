import { NotFoundError, requireAuth } from "@goodmanltd/common";
import express, { NextFunction, Request, Response } from "express";
import { Order } from "../model/order";

const router = express.Router();

router.get(
  `/api/order/`,
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await Order.find({
        userId: req.currentUser!.id,
      }).populate("ticket");

      res.send(orders);
    } catch (error) {
      next(error);
    }
  }
);
export { router as listOrderRouter };
