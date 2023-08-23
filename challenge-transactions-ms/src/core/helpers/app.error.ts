export class ApplicationError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'APPLICATION_ERROR';
    this.status = status ?? this.status;
  }
}
