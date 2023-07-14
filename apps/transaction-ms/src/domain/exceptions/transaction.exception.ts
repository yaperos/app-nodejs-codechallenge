import { BaseException, ExceptionCode } from './base.exception';

export class TransactionFindException extends BaseException {
  constructor(message: string) {
    super(TransactionFindException.getMessage(message));
    this.name = ExceptionCode.TRANSACTION_FIND_EXCEPTION;
  }

  static getMessage(message: string) {
    return `Transaction find error: ${message}`;
  }
}

export class TransactionCreateException extends BaseException {
  constructor(message: string) {
    super(TransactionCreateException.getMessage(message));
    this.name = ExceptionCode.TRANSACTION_CREATE_EXCEPTION;
  }

  static getMessage(message: string) {
    return `Transaction create error: ${message}`;
  }
}

export class TransactionUpdateException extends BaseException {
  constructor(message: string) {
    super(TransactionUpdateException.getMessage(message));
    this.name = ExceptionCode.TRANSACTION_UPDATE_EXCEPTION;
  }

  static getMessage(message: string) {
    return `Transaction update error: ${message}`;
  }
}
