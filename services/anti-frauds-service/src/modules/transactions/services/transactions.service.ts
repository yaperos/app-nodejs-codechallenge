import { Inject, Injectable, Logger } from '@nestjs/common';
import { ValidateTransactionDto } from '../dto/validate-transaction.dto';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionApprovedMessage } from '../messages/transaction-approved.message';
import { TransactionRejectedMessage } from '../messages/transaction-rejected.message';

@Injectable()
export class TransactionsService {
  private readonly logger: Logger = new Logger(TransactionsService.name);

  constructor(
    @Inject('ANTI_FRAUD_PRODUCER')
    private readonly antiFraudProducer: ClientKafka,
  ) {}

  validate(validateTransactionDto: ValidateTransactionDto) {
    const { transactionId, value } = validateTransactionDto;
    try {
      this.logger.debug(
        `Transaction validation started with transactionId [${transactionId}]`,
      );

      if (value > 1000) {
        this.logger.log(
          `Transaction with transactionId [${transactionId}] is invalid`,
        );
        this.antiFraudProducer.emit(
          'transaction_rejected',
          new TransactionRejectedMessage(
            transactionId,
            'Transaction exceed the allowed limit',
          ),
        );
      } else {
        this.logger.log(
          `Transaction with transactionId [${transactionId}] is valid`,
        );
        this.antiFraudProducer.emit(
          'transaction_approved',
          new TransactionApprovedMessage(transactionId),
        );
      }
    } catch (error) {
      this.logger.error(
        `Error trying to validate transaction with transactionId [${transactionId}]: ${error.message}`,
      );
      throw error;
    }
  }
}
