export abstract class CustomError extends Error {
  // must have a statusCode
  abstract statusCode: number;

  // also pass a message to super so as to keep the default behaviour of Error class
  constructor(message: string) {
    // default behaviour when pass a str -> log it to console
    super(message);
    // Only because we extend build-in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  // a func that must return the custom format array
  abstract serializeErrors(): { message: string; field?: string }[];
}
