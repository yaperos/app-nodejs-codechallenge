import { produceMessage } from '@context/shared/infrastructure/adapters/kafka/Producer';
import Logger from '@context/shared/infrastructure/impl/WinstonInfoLogger';
import { CreateTransaction } from '@context/transactions/application/uses_cases/create/CreateTransaction';
import { GetTransactionByExternalId } from '@context/transactions/application/uses_cases/find/GetTransactionByExternalId';
import { UpdateTransaction } from '@context/transactions/application/uses_cases/update/UpdateTransaction';
import Transaction from '@context/transactions/domain/class/Transaction';
import { TransactionStatusType } from '@context/transactions/domain/enums/TransactionStatusType';

export class TransactionService {
  constructor(private createTransactionUseCase: CreateTransaction, private updateTransactionUseCase: UpdateTransaction, private getTransactionByExternalIdUseCase: GetTransactionByExternalId) {}

  async transactionHandler(transaction: Transaction): Promise<Transaction> {
    const status = this.validateTransaction(transaction.value);

    // rejected flow
    if (status === TransactionStatusType.REJECTED) {
      transaction.status = TransactionStatusType.REJECTED;
      const transactionUpdated = await this.updateTransaction(transaction);

      Logger.info(`Transaction status ->> ${status}`);
      return transactionUpdated;
    }

    // create transaction flow
    transaction.status = TransactionStatusType.PENDING;
    await this.createTransaction(transaction);

    // update transaction flow
    transaction.status = TransactionStatusType.APPROVED;
    const transactionUpdated = await this.updateTransaction(transaction);

    return transactionUpdated;
  }

  async createTransaction(transactionData: Transaction): Promise<string> {
    const transactionCreatedId = await this.createTransactionUseCase.run(transactionData);

    await this.emitEvent(transactionData.transactionExternalId, transactionData.status)

    return transactionCreatedId;
  }

  async updateTransaction(transactionData: Transaction): Promise<Transaction> {
    const transactionUpdated = await this.updateTransactionUseCase.run(transactionData);

    await this.emitEvent(transactionData.transactionExternalId, transactionData.status)

    return transactionUpdated;
  }

  async getTransactionByExternalId(externalId: number): Promise<Transaction | null> {
    return await this.getTransactionByExternalIdUseCase.run(externalId);
  }

  private validateTransaction(value: number): string {
    return value > 1000 ? TransactionStatusType.REJECTED : TransactionStatusType.PENDING;
  }

  private async emitEvent(transactionExternalId: string, status: string) {
    await produceMessage('transactionStatusTopic', {
      transactionExternalId: transactionExternalId,
      newStatus: status,
    });
  }
}
