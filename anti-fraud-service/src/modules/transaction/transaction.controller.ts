import { ITransaction } from './transaction.interface';
import { TransactionService } from './transaction.service';

export class TransactionController {
  private service: TransactionService;

  constructor(service: TransactionService) {
    this.service = service;
  }

  handleTransactionValidation = (message: string) => {
    const transactionData: ITransaction = JSON.parse(message);
    this.service.validate(transactionData);
  };
}
