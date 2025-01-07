import express, { Request, Response, NextFunction } from "express";
import { stripe } from "../stripe";
const bodyParser = require("body-parser");

const router = express.Router();

const endPointSecret =
  "whsec_f439825b8ac84cfc332493f5908efe5cb6b59340b859b71bba76fa7a14d3eb2e";
router.post(
  "/api/payment/status",
  bodyParser.text({ type: "*/*" }),
  async (req: Request, res: Response, next: NextFunction) => {
    const sig = req.headers["stripe-signature"];
    let event = null;
    console.log(`payment status body ${JSON.stringify(req.body)}`);
    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, endPointSecret);
      console.log(`event: ${JSON.stringify(event)}`);
    } catch (error) {
      next(error);
    }

    let intent = null;
    switch (event!["type"]) {
      case "payment_intent.succeeded":
        intent = event.data.object;
        console.log("Succeeded:", intent.id);
        break;
      case "payment_intent.payment_failed":
        intent = event.data.object;
        const message =
          intent.last_payment_error && intent.last_payment_error.message;
        console.log("Failed:", intent.id, message);
        break;
      case "payment_intent.created":
        console.log("payment intent created received");
        break;
    }

    res.sendStatus(200);
  }
);

export { router as paymentStatusRouter };
