import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class ReqValidationError extends CustomError {
  statusCode = 400;
  public errors: ValidationError[];
  constructor(errors: ValidationError[]) {
    // pass a str -> just for logging in console
    super('Request Validation Error');
    this.errors = errors;
    // Only because we extend build-in class
    Object.setPrototypeOf(this, ReqValidationError.prototype);
  }

  // embed formatting in the custom class
  serializeErrors() {
    return this.errors.map((error: ValidationError) => {
      return error.type === "field"
        ? { message: error.msg, field: error.path }
        : { message: error.msg };
    });
  }
}
