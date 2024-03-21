import { TransactionDTO } from 'src/transactions/domain/dtos/transactionDto';
import {
  TransactionResponse,
  TransferStatus,
} from 'src/transactions/domain/entities/transaction';
import { IPrimaryPort } from '../ports/primary/ITransactionPrimaryPort';
import { ISecondaryPort } from '../ports/secondary/ITransactionSecondaryPort';
import { structToTransaction } from 'src/transactions/domain/mapper/transaction';

export class TransactionUseCases implements IPrimaryPort {
  constructor(private secondaryPort: ISecondaryPort) {
    this.secondaryPort = secondaryPort;
  }

  async createTransaction(dto: TransactionDTO): Promise<TransactionResponse> {
    const status =
      dto.value > 1000 ? TransferStatus.REJECTED : TransferStatus.APPROVED;

    const createdTransaction = structToTransaction(
      await this.secondaryPort.createTransaction(dto),
    );
    await this.secondaryPort.updateTransactionStatusQueue(
      createdTransaction.transactionExternalId,
      status,
    );

    return createdTransaction;
  }

  async getTransaction(id: string): Promise<TransactionResponse> {
    return structToTransaction(await this.secondaryPort.getTransaction(id));
  }

  async updateTransactionStatus(
    transactionId: string,
    status: string,
  ): Promise<void> {
    return await this.secondaryPort.updateTransactionStatus(
      transactionId,
      status,
    );
  }
}
