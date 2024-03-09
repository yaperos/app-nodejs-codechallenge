import { Injectable } from '@nestjs/common';
import { TransactionReq } from './interfaces/transaction-request';
import { TransactionRes } from './interfaces/transaction-response';

@Injectable()
export class AntiFraudService {
  validateTransaction(message: TransactionReq): TransactionRes {
    let transactionResponse: TransactionRes = new TransactionRes();

    transactionResponse.transactionExternalId = message.transactionExternalId;
    transactionResponse.status = message.value > 1000 ? 'rejected' : 'accepted';

    return transactionResponse;
  }
}
