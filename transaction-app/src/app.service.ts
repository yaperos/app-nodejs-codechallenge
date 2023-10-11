import { Inject, Injectable } from '@nestjs/common';
import { TransactionCreatedEvent } from './events/transaction-created.event';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { GetAntifraudRequest } from './requests/get-antifraud-request.dto';

@Injectable()
export class AppService {
  constructor(@Inject('ANTIFRAUD_SERVICE') private readonly antifraudClient: ClientKafka) { }
  getHello(): string {
    return 'Hello World!';
  }

  handleTransactionCreated({ accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value }: TransactionCreatedEvent) {
    // const transaction = new TransactionCreatedEvent(accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value)
    const validateTransaction = new GetAntifraudRequest(value, accountExternalIdCredit)
    this.antifraudClient
      .send('validate-transaction', validateTransaction.toString())
      .subscribe((response) => {
        console.log(response)
      })
  }
}
