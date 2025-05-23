import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  statusCode = 400;
  public message: string;
  constructor(message: string) {
    super(message);
    this.message = message;
    // Only because we extend build-in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
