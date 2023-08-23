import { ApiTransactionRepository } from "../../repositories/transaction/TransactionImpl";
import {
  ITransaction,
  ITransactionBody,
} from "../../types/transaction/Transaction";
import { ITransactionRepository } from "../../types/transaction/TransactionRepository";

export class TransactionServices implements ITransactionRepository {
  private apiPermissionRepository: ApiTransactionRepository;
  constructor() {
    this.apiPermissionRepository = new ApiTransactionRepository();
  }

  async getById(transactionExternalId: string): Promise<ITransaction> {
    return this.apiPermissionRepository.getById(transactionExternalId);
  }

  async createTransaction(
    iTransactionBody: ITransactionBody
  ): Promise<ITransaction> {
    return this.apiPermissionRepository.createTransaction(iTransactionBody);
  }
}
