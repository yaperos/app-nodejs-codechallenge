import { HttpException, HttpStatus } from '@nestjs/common';
import { ZodError } from 'zod';

export class InvalidSchemaException extends HttpException {
  constructor(error: ZodError) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        errors: InvalidSchemaException.getErrors(error),
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  static getErrors(error: ZodError<any>) {
    const { formErrors, fieldErrors } = error.formErrors;
    if (Object.keys(fieldErrors).length > 0) {
      return fieldErrors;
    }

    return formErrors;
  }
}

export const throwIfInvalidSchemaException = (error: HttpException): void => {
  if (error instanceof InvalidSchemaException) {
    throw error.getResponse()['errors'];
  }
};
