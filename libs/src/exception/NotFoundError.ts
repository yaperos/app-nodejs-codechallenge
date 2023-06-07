import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError {
  constructor() {
    super({ message: "Not found", statusCode: 404 });
  }
}
