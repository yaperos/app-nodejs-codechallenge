import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionRequest } from '../dto/create-transaction-request.dto';
import { TransactionCreatedEvent } from '../transaction-created.event';
import { PARAMETER } from '../constants/app.constant';

@Injectable()
export class AppService {
  constructor(
    @Inject('CLIENT_SERVICE') private readonly client: ClientKafka,
  ) {}

  createTransaction(createTransactionRequest: CreateTransactionRequest) {

    console.log("crt      > ", JSON.stringify(createTransactionRequest))

    const {
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      AmountValue,
    } = createTransactionRequest;

    //if (valueTransaction>PARAMETER.MAX_VALUE)throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);

    this.client.emit(
      'transaction_created',
      new TransactionCreatedEvent(
        accountExternalIdDebit,
        accountExternalIdCredit,
        tranferTypeId,
        AmountValue,
      ),
    );
    return {
      process: 'transaction_created',
      status: true,
    };
  }
}
