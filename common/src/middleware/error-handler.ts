import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-error";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  console.error(err);
  return res.status(400).send({ errors: [{ message: "Error Occured" }] });
}
