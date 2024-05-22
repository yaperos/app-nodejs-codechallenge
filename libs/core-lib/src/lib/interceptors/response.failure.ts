import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class ReponseFailureFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const oldResponse = exception.getResponse();

    const request = ctx.getRequest();

    if (request.url.includes('health')) {
      return response.status(status).json(oldResponse);
    }

    let messageString = '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = oldResponse as any;
    if (typeof res.message === 'string') {
      messageString = res.message;
    } else {
      const array = res.message as string[];
      messageString = array.reduce((prev, curr) => {
        return prev + ' ' + curr;
      });
    }
    response.status(status).json({
      statusCode: status,
      message: messageString,
    });
  }
}
