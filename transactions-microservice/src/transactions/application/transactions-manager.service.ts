import { Injectable } from '@nestjs/common';
import { GetTransactionDto } from 'src/transactions/infrastructure/in/dtos/get-transaction.dto';
import { TransactionsPersistenceService } from 'src/transactions/infrastructure/out/transactions-persistence.service';
import { UpdateTransactionStatusDto } from 'src/transactions/infrastructure/in/dtos/update-transacton--status.dto';
import { TransactionId } from 'src/transactions/domain/TransactionId';
import { TransactionStatus } from 'src/transactions/domain/TransactionStatus';
import { TransactionPrimitives } from 'src/transactions/domain/Transaction';

@Injectable()
export class TransactionsManagerService {
  constructor(private readonly transactionsPersistenceService: TransactionsPersistenceService) {}

  async updateTransactionStatus(dto: UpdateTransactionStatusDto): Promise<void> {
    await this.transactionsPersistenceService.updateTransactionStatus(
      new TransactionId(dto.uuid),
      new TransactionStatus(dto.transactionStatus.name),
    );
  }
  async getTransaction({ transaction }: GetTransactionDto): Promise<TransactionPrimitives> {
    return await this.transactionsPersistenceService.getTransaction(new TransactionId(transaction));
  }
}
