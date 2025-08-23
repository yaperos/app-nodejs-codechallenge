import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: object, host: ArgumentsHost) {

    const httpException = this.convertToHttpException(exception);

    throw httpException;
  }

  private convertToHttpException(exception: object): HttpException {

    if (exception instanceof HttpException || exception instanceof BadRequestException) {
      return exception;
    }

    const status = (exception as { status?: number })?.status;
    const message = (exception as { message?: string })?.message;
    const errors = (exception as { response?: unknown })?.response;

    const errorDetail = errors ?? {message};

    const errorBody = {
        message,
        errors: [errorDetail],
    };
    return new HttpException(
      errorBody,
      status ?? 500,
    );
  }
}