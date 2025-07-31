import { validationResult } from "express-validator";
import { ReqValidationError } from "../errors/request-validation-error";
import { NextFunction, Request, Response } from "express";

export default function validateRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // check if req pass validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ReqValidationError(errors.array());
  }

  next();
}
