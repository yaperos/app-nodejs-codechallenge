import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, ClientProxy } from '@nestjs/microservices';
import { CreateTransactionDto, TransactionPresenter } from '@payments/shared/dto';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable()
export class AppService {

  constructor(
    @Inject('TRANSACTION_MICROSERVICE') private readonly transactionMicroserviceClient: ClientProxy,
    @Inject('ANTIFRAUD_MICROSERVICE') private readonly antifraudMicroserviceClient: ClientKafka,
  ){}

  createTransaction(createTransactionDto: CreateTransactionDto): Observable<TransactionPresenter>{
    return this.transactionMicroserviceClient.send<TransactionPresenter>('create-transaction', createTransactionDto)
      .pipe(
        map((data: TransactionPresenter) => {
          this.antifraudMicroserviceClient.emit('validate_amount', JSON.stringify(data));
          return data;
        }));
  }
}
