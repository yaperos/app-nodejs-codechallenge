import { BaseError } from "./BaseError";

export class ConfigurationError extends BaseError {
  constructor() {
    super({ message: "Invalid configurarion value", statusCode: 500 });
  }
}
