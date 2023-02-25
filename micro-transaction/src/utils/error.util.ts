export class GeneralError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: any) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
