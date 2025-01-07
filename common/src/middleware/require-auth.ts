import { NextFunction, Request, Response } from "express";
import { NotAuthError } from "../errors/notAuthError";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // assume that this requireAuth is always call after currentUser middleware
  if (!req.currentUser) {
    throw new NotAuthError();
  }
  next();
}
