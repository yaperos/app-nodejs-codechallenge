import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionStatus } from 'src/common/transaction.type';
import { ValidateTransactionDto } from 'src/dto/transaction.dto';

export class TransactionEvent {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionClient: ClientKafka,
  ) {}

  public approved(validateTransactionDto: ValidateTransactionDto) {
    this.transactionClient.emit(
      'transaction_approved',
      JSON.stringify({
        transactionExternalId: validateTransactionDto.transactionExternalId,
        status: TransactionStatus.approved,
      }),
    );
  }

  public rejected(validateTransactionDto: ValidateTransactionDto) {
    this.transactionClient.emit(
      'transaction_approved',
      JSON.stringify({
        transactionExternalId: validateTransactionDto.transactionExternalId,
        status: TransactionStatus.rejected,
      }),
    );
  }
}
