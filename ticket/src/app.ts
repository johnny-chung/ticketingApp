import express, { NextFunction, Request, Response } from "express";
import { json } from "body-parser";
import { NotFoundError, currentUserMW, errorHandler } from "@goodmanltd/common";
import cookieSession from "cookie-session";
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";
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

app.use(showTicketRouter);
app.use(createTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all("*", async (req, res, next) => {
  next(new NotFoundError());
});

// error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export { app };
