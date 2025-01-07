import express, { NextFunction, Request, Response } from "express";
import { json } from "body-parser";
import { NotFoundError, currentUserMW, errorHandler } from "@goodmanltd/common";
import cookieSession from "cookie-session";
import { listOrderRouter } from "./routes/listOrder";
import { showOrderRouter } from "./routes/showOrder";
import { newOrderRouter } from "./routes/newOrder";
import { deleteOrderRouter } from "./routes/deleteOrder";

const app = express();
app.use(json());
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

app.use(listOrderRouter);
app.use(showOrderRouter);
app.use(newOrderRouter);
app.use(deleteOrderRouter);

app.all("*", async (req, res, next) => {
  next(new NotFoundError());
});

// error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export { app };
