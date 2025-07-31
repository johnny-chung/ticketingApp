// middleware/current-user.ts

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: string;
  email: string;
}

// handle req.currentUser don;t exist ts error
// don't need to use "extend" -> go to the namespace, interface -> add directly
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export function currentUserMW(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.jwt) {
    // move on to next middleware -> that will handle the error
    return next();
  }
  try {
    // payload is neither a str or object
    // define the payload interface for ts
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;

    // ts checking -> req don't have currentUser props
    req.currentUser = payload;
  } catch (error) {
    console.error(error);
  }
  // always want to go to next middleware, even if jwt is invalid
  next();
}
