import { BaseException, ExceptionCode } from './base.exception';

export class TransferTypeFindException extends BaseException {
  constructor(message: string) {
    super(TransferTypeFindException.getMessage(message));
    this.name = ExceptionCode.TRANSFER_TYPE_FIND_EXCEPTION;
  }

  static getMessage(message: string) {
    return `TransferType find error: ${message}`;
  }
}
