import { Inject, Injectable } from '@nestjs/common';
import { CreateTransaction } from './dto/createTransaction.dto';
import { ClientKafka } from '@nestjs/microservices';
import { TRANSACTION_CREATED } from './constants/constants';
import { TransactionCreated } from './events/transaction-created.event';

@Injectable()
export class AppService {
  constructor(@Inject(`TRANSACTIONS-SERVICE`) private readonly transactionClient: ClientKafka){}

  createTransaction(createTransaction: CreateTransaction){
    this.transactionClient.emit(TRANSACTION_CREATED, 
      new TransactionCreated(
        createTransaction.accountExternalIdDebit,
        createTransaction.accountExternalIdCredit,
        createTransaction.tranferTypeId,
        createTransaction.value
        ))
  }
}
