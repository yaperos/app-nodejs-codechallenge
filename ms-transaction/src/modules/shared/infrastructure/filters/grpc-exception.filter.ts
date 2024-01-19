import { ServerUnaryCallImpl } from '@grpc/grpc-js/build/src/server-call';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { from, Observable } from 'rxjs';
import {
  ConflictError,
  InvalidArgumentError,
  ObjectNotFoundError,
} from 'src/modules/shared/domain/errors';

import { BaseResponseDto } from '../dtos/base-response.dto';

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter<Error> {
  private readonly logger = new Logger(GrpcExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost): Observable<BaseResponseDto> {
    let code: HttpStatus;
    let error: string;
    let messages: string | Array<string>;

    if (exception instanceof HttpException) {
      code = exception.getStatus();
      error = exception.message;

      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object') {
        error = exceptionResponse['error'] ?? error;
        messages = exceptionResponse['message'];
      }
    } else if (exception instanceof ObjectNotFoundError) {
      code = HttpStatus.NOT_FOUND;
      error = exception.message;
    } else if (exception instanceof ConflictError) {
      code = HttpStatus.CONFLICT;
      error = exception.message;
    } else if (exception instanceof InvalidArgumentError) {
      code = HttpStatus.UNPROCESSABLE_ENTITY;
      error = exception.message;
    } else {
      code = HttpStatus.INTERNAL_SERVER_ERROR;
      error = 'Internal server error';
    }
    messages = Array.isArray(messages) ? messages : [messages ?? error];

    this.loggerException(exception, host);

    return from([{ code, error, messages }]);
  }

  private loggerException(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToRpc();
    const server = ctx['getArgs']()[2] as ServerUnaryCallImpl<any, any>;

    this.logger.error(exception.message, exception.stack, {
      path: server.getPath(),
      data: ctx.getData(),
    });
  }
}
