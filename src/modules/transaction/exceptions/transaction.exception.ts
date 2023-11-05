import { CoreException } from '../../core/exceptions/core.exception';

export class TransactionException extends CoreException {
  private error: string;
  private statusCode: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = TransactionException.name;
    this.error = message;
    this.statusCode = statusCode;
  }
}
