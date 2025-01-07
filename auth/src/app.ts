import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { NotFoundError, errorHandler } from "@goodmanltd/common";

const app = express();
app.use(json());

// deal with https from proxy (ingress-ngix)
// make sure express aware of traffic is coming from a proxy (ingress-ngix)
// and trust the proxy (ingress-ngix) > default https from proxy is not trust by express
app.set("trust proxy", true);

// cookie session middleware
app.use(
  cookieSession({
    signed: false, // not using any cookie encryption -> encrypt with JWT on our own
    // secure: true -> only share cookie over https
    // supertest -> http -> no cookie
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// route not found -> throw error that will be handle by errorHandler
// app.all("*", () => {
//   throw new NotFoundError();
// });

// if async function -> need to use next to pass error to errorHandler
app.all("*", async (req, res, next) => {
  next(new NotFoundError());
});

// error handling
app.use(errorHandler);

export { app };
