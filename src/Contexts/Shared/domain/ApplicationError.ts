export class ApplicationError extends Error {
  public readonly name: string;
  public readonly data?: any;

  constructor(message: string, name: string, data?: any) {
    super(message);
    this.name = name;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}
