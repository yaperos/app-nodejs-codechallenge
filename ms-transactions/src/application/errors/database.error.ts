export class DbError extends Error {
  name = 'DbError';
  error: any;
  constructor(error: any, message: string) {
    super(message);
    this.error = error;
    Object.setPrototypeOf(this, DbError.prototype);
  }
}
