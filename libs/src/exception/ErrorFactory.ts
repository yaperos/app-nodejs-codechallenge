import { ValidationError } from "yup";
import { BadRequestError } from "./BadRequestError";
import { BaseError } from "./BaseError";
import { InternalServerError } from "./InternalServerError";

export class ErrorFactory {
  static create(e: unknown) {
    if (e instanceof BaseError) {
      return e;
    }
    if (ValidationError.isError(e) || e instanceof ValidationError) {
      return new BadRequestError(e.message);
    }
    return new InternalServerError();
  }
}
