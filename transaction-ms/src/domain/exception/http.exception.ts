import { HttpException } from '@nestjs/common';

interface Error {
  status: number;
  message: string;
  code: string;
}

export class HttpDomainException extends HttpException {
  http_status: number;
  error?: Error;

  constructor(status: number, code: string, message: string) {
    super(message, status);
    this.http_status = status;
    this.error = {
      status,
      message,
      code
    };
  }
}
