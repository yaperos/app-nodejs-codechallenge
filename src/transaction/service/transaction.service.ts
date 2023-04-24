import { Injectable } from '@nestjs/common';
import { TransactionRequest } from '../model/request/transaction-request';
import { TransactionRepository } from '../repository/transaction.repository';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { TransactionResponseData } from '../model/response/transaction-data.response';
import { TransactionResponse } from '../model/response/transaction.response';
import { ProducerService } from '@core/notificator';
import { Utils } from '../../util/utils';

@Injectable()
export class TransactionService {
  entity: TransactionResponseData[];

  constructor(private sendEvent: ProducerService,
    private repository: TransactionRepository,
    private util: Utils) { }

  create(request: TransactionRequest): Observable<TransactionResponseData[]> {
    const __dataToSave = request.transactionRequest.map(data => this.util.builderCreateTransaction(data));
    return this.repository.save(__dataToSave)
      .pipe(
        catchError((e) => {
          return throwError(() => e)
        }),
        map(data =>
          data.map(trans =>
            this.util.buildResponseData(trans))
        ),
        tap((data) => 
        data.map(trans =>
          this.sendEvent.__producer([{data: trans}])
          ))
      );
  }

  get(): Observable<TransactionResponse[]> {
    return this.repository.find()
      .pipe(
        map(data =>
          data.map(trans =>
            this.util.buildResponseFind(trans))
        )
      );
  }

  getById(id: string): Observable<TransactionResponse> {
    return this.repository.findById(id)
      .pipe(
        map(data =>
          this.util.buildResponseFind(data)
        )
      )
  }


}
