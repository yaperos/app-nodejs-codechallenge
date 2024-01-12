export class BaseError extends Error {
  public status: number;
  public info?: { error: string };

  constructor(message: string, status: number, info?: { error: string }) {
    super(message);
    this.status = status;
    this.info = info;
  }
}
