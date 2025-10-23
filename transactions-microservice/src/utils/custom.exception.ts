import { HttpException } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(responseMessage: string, httpStatusCode: number) {
    super(responseMessage, httpStatusCode);
  }
}
