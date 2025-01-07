import { CustomError } from "./custom-error";

export class DBError extends CustomError {
  statusCode = 500;
  reason = "DB Connection Error";
  constructor() {
    super('DB Connection Error');

    // Only because we extend build-in class
    Object.setPrototypeOf(this, DBError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
