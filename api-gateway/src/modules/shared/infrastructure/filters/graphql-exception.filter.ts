import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError, GraphQLResolveInfo } from 'graphql';

import { GrpcError, InvalidArgumentError } from '../../domain/errors';

@Catch()
export class GraphQLExceptionFilter implements ExceptionFilter<Error> {
  private readonly logger = new Logger(GraphQLExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost): GraphQLError {
    let code: HttpStatus;
    let error: string;
    let message: string | Array<string>;

    if (exception instanceof HttpException) {
      code = exception.getStatus();
      error = exception.message;

      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object') {
        error = exceptionResponse['error'] ?? error;
        message = exceptionResponse['message'];
      }
    } else if (exception instanceof GrpcError) {
      code = exception.code;
      error = exception.error;
      message =
        exception.messages?.length == 1
          ? exception.messages.shift()
          : exception.messages;
    } else if (exception instanceof InvalidArgumentError) {
      code = HttpStatus.UNPROCESSABLE_ENTITY;
      error = exception.message;
    } else {
      code = HttpStatus.INTERNAL_SERVER_ERROR;
      error = 'Internal server error';
    }
    message ??= error;

    this.loggerException(exception, host);

    return new GraphQLError(error, { extensions: { code, message } });
  }

  private loggerException(exception: Error, host: ArgumentsHost) {
    const ctx = GqlArgumentsHost.create(host);
    const info = ctx.getInfo<GraphQLResolveInfo>();
    const rawArgs = ctx.getArgs();

    this.logger.error(exception.message, exception.stack, {
      type: info.parentType.name,
      path: {
        key: info.path.key,
        name: info.fieldName,
        args: rawArgs,
      },
      body: info.operation.loc?.source.body,
    });
  }
}
