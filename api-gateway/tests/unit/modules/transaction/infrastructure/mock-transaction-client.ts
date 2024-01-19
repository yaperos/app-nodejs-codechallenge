import { Observable } from 'rxjs';
import {
  CreateRequest,
  FindOneRequest,
  PaginatedTransactionsResponse,
  TransactionClient,
  TransactionResponse,
} from 'src/modules/transaction/infrastructure/resources/transaction.pb';

export class MockTransactionClient implements TransactionClient {
  private mockFindOne = jest.fn();
  private mockCreate = jest.fn();

  private findOneResponse$: Observable<TransactionResponse>;
  private createResponse$: Observable<TransactionResponse>;

  findPaginated(): Observable<PaginatedTransactionsResponse> {
    throw new Error('Method not implemented.');
  }

  returnOnFindOne(observable: Observable<TransactionResponse>): void {
    this.findOneResponse$ = observable;
  }

  findOne(request: FindOneRequest): Observable<TransactionResponse> {
    this.mockFindOne(request);
    return this.findOneResponse$;
  }

  assertFindOneByHasBeenCalledWith(request: FindOneRequest) {
    expect(this.mockFindOne).toHaveBeenCalledWith(request);
  }

  returnOnCreate(observable: Observable<TransactionResponse>): void {
    this.createResponse$ = observable;
  }

  create(request: CreateRequest): Observable<TransactionResponse> {
    this.mockCreate(request);
    return this.createResponse$;
  }

  assertCreateByHasBeenCalledWith(request: CreateRequest) {
    expect(this.mockCreate).toHaveBeenCalledWith(request);
  }
}
