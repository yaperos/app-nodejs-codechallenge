import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class CatchAllErrorsFilter implements ExceptionFilter {
  private readonly logger = new Logger(CatchAllErrorsFilter.name);

  catch(exception: any, host: ArgumentsHost): any {
    this.logger.error(exception.stack);

    const ctx = host.switchToHttp();
    const httpException = this.selectHttpException(exception);
    const response = ctx.getResponse<Response>();

    response.status(httpException.getStatus()).json({
      statusCode: this.getStatusCode(httpException),
      error: this.getError(httpException),
      message: this.formatMessage(exception),
    });
  }

  private getStatusCode(httpException: HttpException) {
    return (
      (httpException.getResponse() as Record<string, unknown>)['statusCode'] ||
      httpException.getStatus()
    );
  }

  private getError(httpException: HttpException) {
    return (
      (httpException.getResponse() as Record<string, unknown>)['message'] ||
      httpException.getResponse()
    );
  }

  private formatMessage(exception: any) {
    return exception.message;
  }

  private selectHttpException(exception: any) {
    if (exception instanceof HttpException) return exception;
    // Podemos poner un diccionario de errores..
    //  else if (exception instanceof CustomValidationError) return new NotFoundException() de nestjs
    else {
      this.logger.warn(`Unidentified exception: ${exception.name}`);
      return new InternalServerErrorException();
    }
  }
}
