import { BaseError } from "./BaseError";

export class InternalServerError extends BaseError {
  constructor() {
    super({ message: "Internal server error", statusCode: 500 });
  }
}
