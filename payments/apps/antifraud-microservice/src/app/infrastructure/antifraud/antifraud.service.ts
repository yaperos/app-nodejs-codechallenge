import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TransactionPresenter, UpdateTransactionDto } from '@payments/shared/dto';
import { MicroserviceClient } from '@payments/shared/constant';
import { StatusInterface } from '@payments/shared/model';
import { Observable, of, switchMap } from 'rxjs';

@Injectable()
export class AntifraudService {
  constructor( @Inject(MicroserviceClient.Transaction) private readonly transactionMicroserviceClient: ClientProxy){}

  validateAndUpdateTransaction(transaction: TransactionPresenter): Observable<TransactionPresenter>{
    return of(transaction).pipe(
      switchMap((data: TransactionPresenter) => {
        const transactionValidated = ({ externalId: transaction.transactionExternalId, status: data.value <= 1000 ? StatusInterface.APPROVED: StatusInterface.REJECTED} as UpdateTransactionDto);
        return this.transactionMicroserviceClient.send<TransactionPresenter>('update-transaction', transactionValidated);
      })
    );
  }
}
