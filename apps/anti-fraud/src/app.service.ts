import {Inject, Injectable} from '@nestjs/common';
import {ClientKafka} from '@nestjs/microservices';
import {TransactionToVerifyDTO} from './dtos/transaction.to.verify.dto';
import {TransactionStatus} from './common/transaction.enum';
import {TRANSACTION_LIMIT} from './common/transaction.contants';
import {VerifiedTransactionDTO} from './dtos/verified.transaction.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('ANTI_FRAUD_SERVICE') private readonly kafkaService: ClientKafka,
  ) {}

  verifyTransaction(transaction: TransactionToVerifyDTO): void {
    const verifiedTransaction: VerifiedTransactionDTO = {
      transactionExternalId: transaction.transactionExternalId,
      status:
        transaction.value > TRANSACTION_LIMIT
          ? TransactionStatus.REJECTED
          : TransactionStatus.APPROVED,
    };
    const message = JSON.stringify(verifiedTransaction);
    console.log('[verifyTransaction] RESPONSE: ', verifiedTransaction);
    this.kafkaService.emit('transaction-verified', message);
  }
}
