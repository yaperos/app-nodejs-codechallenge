import { injectable } from 'inversify';
import { ITransaction } from './transaction.interface';
import { TransactionService } from './transaction.service';

@injectable()
export class TransactionController {
  private readonly _service: TransactionService;

  constructor(service: TransactionService) {
    this._service = service;
  }

  handleTransactionValidation = async (message: string) => {
    const transactionData: ITransaction = JSON.parse(message);
    await this._service.validate(transactionData);
  };
}
