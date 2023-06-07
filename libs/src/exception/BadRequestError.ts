import { BaseError } from "./BaseError";

export class BadRequestError extends BaseError {
  constructor(message?: string) {
    super({ message: message || "Bad request", statusCode: 400 });
  }
}
