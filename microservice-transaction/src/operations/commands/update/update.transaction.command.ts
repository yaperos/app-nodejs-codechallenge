import { ICommand } from '@nestjs/cqrs';
import { TransactionStatus } from 'src/common/transaction.enum';


export class UpdateTransactionCommand implements ICommand {
  readonly transactionExternalId: string;
  readonly status: TransactionStatus;

  constructor (transactionExternalId: string, status: TransactionStatus) {
    this.transactionExternalId = transactionExternalId;
    this.status = status;
  }
}

