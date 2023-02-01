import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TransactionPresenter, UpdateTransactionDto } from '@payments/shared/dto';
import { map, Observable, of, switchMap } from 'rxjs';

@Injectable()
export class AppService {
  constructor( @Inject('TRANSACTION_MICROSERVICE') private readonly transactionMicroserviceClient: ClientProxy){}

  validateAndUpdateTransaction(transaction: TransactionPresenter): Observable<TransactionPresenter>{
    return of(transaction).pipe(
      switchMap((data: TransactionPresenter) => {
        const transactionValidated = ({ externalId: transaction.transactionExternalId, status: data.value <= 1000 ? 'approved': 'rejected'} as UpdateTransactionDto);
        return this.transactionMicroserviceClient.send<TransactionPresenter>('update-transaction', transactionValidated);
      })
    );
  }
}
