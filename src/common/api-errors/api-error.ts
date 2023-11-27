import { HttpStatus } from '@nestjs/common';

export class ApiError {
  constructor(
    public status: HttpStatus,
    public msg: string,
  ) {}
}

export const INTERNAL_SERVER_ERROR_MESSAGE =
  'something went wrong, please try again later';
