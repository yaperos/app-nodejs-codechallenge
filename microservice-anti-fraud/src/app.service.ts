import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionToVerifyDTO } from './dtos/transaction.to.verify.dto';
import { TRANSACTION_LIMIT, TransactionStatus } from './common/transaction.enum';
import { VerifiedTransactionDTO } from './dtos/verified.transaction.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('ANTI_FRAUD_SERVICE') private readonly kafkaService: ClientKafka,
  ) {}
  
  verifyTransaction(transaction: TransactionToVerifyDTO): void {
    const verifiedTransaction: VerifiedTransactionDTO  = {
      transactionExternalId: transaction.transactionExternalId,
      status: transaction.value > TRANSACTION_LIMIT ? 
        TransactionStatus.REJECTED : 
        TransactionStatus.APPROVED,
    };
    const message = JSON.stringify(verifiedTransaction);
    Logger.log('[verifyTransaction] RESPONSE: ', verifiedTransaction);
    this.kafkaService.emit('transaction-verified', message);
  }
}
