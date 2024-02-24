import { HttpStatus } from '@nestjs/common';
import { Exceptions } from './exceptions';

export const transactionNotFoundError = {
  message: Exceptions.transactionNotFoundMessage,
  status: HttpStatus.BAD_REQUEST,
  code: Exceptions.transactionNotFoundCode
};
