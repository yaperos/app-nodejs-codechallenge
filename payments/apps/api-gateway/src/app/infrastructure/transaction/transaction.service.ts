import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, ClientProxy } from '@nestjs/microservices';
import { CreateTransactionDto, TransactionPresenter } from '@payments/shared/dto';
import { MicroserviceClient } from '@payments/shared/constant';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable()
export class TransactionService {

  constructor(
    @Inject(MicroserviceClient.Transaction) private readonly transactionMicroserviceClient: ClientProxy,
    @Inject(MicroserviceClient.Antifraud) private readonly antifraudMicroserviceClient: ClientKafka,
  ){}

  createTransaction(createTransactionDto: CreateTransactionDto): Observable<TransactionPresenter>{
    return this.transactionMicroserviceClient.send<TransactionPresenter>('create-transaction', createTransactionDto)
      .pipe(
        map((data: TransactionPresenter) => {
          this.antifraudMicroserviceClient.emit('validate_amount', JSON.stringify(data));
          return data;
        }));
  }

  getTransaction(id: string): Observable<TransactionPresenter>{
    return this.transactionMicroserviceClient.send<TransactionPresenter>('get-transaction', id);
  }
}
