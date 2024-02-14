import { ITransactionRequest } from '../interfaces/transaction.interface';
import { Transaction, TransactionStatus } from '../models/transaction.model';
import { TransactionRepository } from '../repository/transaction.repository';
import { uuidGenerator } from '../utils/uuid-generator';

export class TransactionService {
  private transactionRepository: TransactionRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
  }

  async getTransaction(transactionId: string) {
    const transaction = await this.transactionRepository.findOne(transactionId);
    return transaction;
  }

  async createTransaction(body: ITransactionRequest) {
    const newTransactionId = uuidGenerator();

    const data: Transaction = {
      id: newTransactionId,
      transferTypeId: body.transferTypeId,
      value: body.value,
      status: TransactionStatus.pending,
      accountExternalIdDebit: body.accountExternalIdDebit,
      accountExternalIdCredit: body.accountExternalIdCredit,
    };

    await this.transactionRepository.insert(data);

    return data;
  }
}
