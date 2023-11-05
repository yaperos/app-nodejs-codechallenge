import { HttpStatus } from '@nestjs/common';
import { IExceptionMapper } from '../interfaces/exception-mapper';
import { NOTIFICATIONS_ERRORS } from '../constants/notifications-errors.constant';

export class ExceptionHttpMapper implements IExceptionMapper {
  public map(exception) {
    const errorsCatalog = {
      ...NOTIFICATIONS_ERRORS,
    };
    const defaultHttpInternalServerError = {
      error: exception.message,
      message: 'Internal Server Error',
      httpStatusCode: exception.status || HttpStatus.INTERNAL_SERVER_ERROR,
    };
    const httpErrorDefinition =
      exception.message in errorsCatalog
        ? errorsCatalog[exception.message]
        : defaultHttpInternalServerError;

    return {
      statusCode: httpErrorDefinition.httpStatusCode,
      error: exception.message,
      message: httpErrorDefinition.message,
      timestamp: new Date().toISOString(),
    };
  }
}
