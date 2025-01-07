import express, { NextFunction, Request, Response } from "express";
import { json } from "body-parser";
import { NotFoundError, currentUserMW, errorHandler } from "@goodmanltd/common";
import cookieSession from "cookie-session";
import { createPaymentIntentRouter } from "./routes/newPaymentIntent";
import { paymentStatusRouter } from "./routes/paymentStatus";

const app = express();
app.set("trust proxy", true);

app.use(
  cookieSession({
    signed: false, // not using any cookie encryption -> encrypt with JWT on our own
    // secure: true -> only share cookie over https
    // supertest -> http -> no cookie
    secure: process.env.NODE_ENV !== "test",
  })
);
// middlware, set req.currentUser props
app.use(currentUserMW);

// stripe require body parser to text instead of json
// put the route before json
app.use(paymentStatusRouter);

app.use(json());
// router
app.use(createPaymentIntentRouter);

app.all("*", async (req, res, next) => {
  next(new NotFoundError());
});

// error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export { app };
