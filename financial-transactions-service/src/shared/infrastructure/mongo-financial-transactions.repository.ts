import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { FinancialTransaction } from '../../core/create-financial-transaction/domain/financial-transaction';
import { FinancialTransactionId } from '../../core/create-financial-transaction/domain/financial-transaction-id';
import { FinancialTransactionStatus } from '../../core/create-financial-transaction/domain/financial-transaction-status';
import { FinancialTransactionsRepository } from '../../core/create-financial-transaction/domain/financial-transactions.repository';
import { FinancialTransactionEntity } from './financial-transaction.entity';

@Injectable()
export class MongoFinancialTransactionsRepository
  implements FinancialTransactionsRepository
{
  constructor(
    @InjectRepository(FinancialTransactionEntity)
    private readonly repository: MongoRepository<FinancialTransactionEntity>,
  ) {}

  async save(financialTransaction: FinancialTransaction): Promise<void> {
    const financialTransactionEntity = new FinancialTransactionEntity();

    financialTransactionEntity.externalId = financialTransaction.id.value;
    financialTransactionEntity.accountExternalIdDebit =
      financialTransaction.accountDebit.id.value;
    financialTransactionEntity.accountExternalIdCredit =
      financialTransaction.accountCredit.id.value;
    financialTransactionEntity.value = financialTransaction.value.value;
    financialTransactionEntity.transferTypeId = financialTransaction.type.value;
    financialTransactionEntity.transferStatusId =
      financialTransaction.status.value;
    financialTransactionEntity.createdAt = financialTransaction.createdAt.value;

    this.repository.save(financialTransactionEntity);
  }

  async findOne(id: FinancialTransactionId): Promise<FinancialTransaction> {
    const financialTransactionEntity = await this.repository.findOneByOrFail({
      where: { externalId: id.value },
    });

    return FinancialTransaction.fromPrimitives({
      id: financialTransactionEntity.externalId,
      accountDebitId: financialTransactionEntity.accountExternalIdDebit,
      accountCreditId: financialTransactionEntity.accountExternalIdCredit,
      value: financialTransactionEntity.value,
      transferTypeId: financialTransactionEntity.transferTypeId,
      transferStatusId: financialTransactionEntity.transferStatusId,
    });
  }

  async updateStatus(
    id: FinancialTransactionId,
    financialTransactionStatus: FinancialTransactionStatus,
  ): Promise<number> {
    const updateResult = await this.repository.updateOne(
      { externalId: id.value },
      {
        $set: {
          transferStatusId: financialTransactionStatus.value,
        },
      },
    );

    return updateResult.modifiedCount;
  }
}
