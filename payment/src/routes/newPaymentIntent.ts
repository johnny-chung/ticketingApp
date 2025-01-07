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
import { stripe } from "../stripe";
import { Payment } from "../model/payment";
import { PaymentIntentCreatedPublisher } from "../event/publishers/paymentIntent-created-publisher";
import { natsClient } from "../nats-client";

const router = express.Router();

router.post(
  "/api/payment",
  requireAuth,
  [body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.body;
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
      console.log("stripe creating payment intent");
      const paymentIntent = await stripe.paymentIntents.create({
        amount: order.price * 100, // in cent
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
        confirm: false,
        //customer: req.currentUser!.id,
      });
      console.log(`paymentIntent: ${JSON.stringify(paymentIntent)}`);

      // save to payment collection
      const payment = Payment.build({
        orderId: orderId,
        paymentIntentId: paymentIntent.id,
      });

      await payment.save();

      // best practice is to use info from collection
      // as some logic may be embedded in the collection when save
      new PaymentIntentCreatedPublisher(natsClient.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        paymentIntentId: payment.paymentIntentId,
      });

      res.status(201).send({ client_secret: paymentIntent.client_secret });
    } catch (error) {
      next(error);
    }
  }
);

export { router as createPaymentIntentRouter };
