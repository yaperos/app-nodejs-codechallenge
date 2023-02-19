import { Status } from "../../entities/status";
import { Transaction } from "../../entities/transaction";
import { AccountExternalId } from "../../entities/value-objects/account-external-id";
import { TransactionId } from "../../entities/value-objects/transaction-id";
import { TransferTypeId } from "../../entities/value-objects/transfer-type-id";
import { TransactionCreated } from "../../events/transaction-created";
import { TransactionRepository } from "../../repositories/ports";
import { TransactionService } from "../ports";

export class YapeTransactionService implements TransactionService {
  constructor(private transactionRepository: TransactionRepository) {}

  async create(
    accountExternalIdDebit: AccountExternalId,
    accountExternalIdCredit: AccountExternalId,
    tranferTypeId: TransferTypeId,
    value: number
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.create(
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value
    );

    new TransactionCreated(transaction).dispatch();

    return transaction;
  }

  async updateStatus(id: TransactionId, status: Status): Promise<void> {
    await this.transactionRepository.updateStatus(id, status);
  }

  async getById(id: TransactionId): Promise<Transaction> {
    return this.transactionRepository.getById(id);
  }
}
