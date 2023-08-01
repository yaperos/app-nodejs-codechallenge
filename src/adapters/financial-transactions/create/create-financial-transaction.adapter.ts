import { Injectable, Scope } from '@nestjs/common';
import { Entities, Ports } from 'src/domain/financial-transactions/create';
import { Repository } from 'typeorm';
import { FinancialTransaction } from '../../../infra/db/entities/financial-transaction.entity';
import { TypeOrmTransactionAdapter } from '../../_shared/db-transaction.adapter';
import uuiAdapter from '../../_shared/uui.adapter';
import { KafkaFinancialTransactionProducerAdapter } from './kafka-financial-transaction-producer.adapter';

@Injectable({ scope: Scope.REQUEST })
export class CreateFinancialTransactionAdapter implements Ports.FinancialTransactionPort {
  private repository: Repository<FinancialTransaction>;
  constructor(
    private readonly transactionAdapter: TypeOrmTransactionAdapter,
    private readonly kafkaProducerAdapter: KafkaFinancialTransactionProducerAdapter,
  ) {
    this.repository = this.transactionAdapter.queryRunner.manager.getRepository(FinancialTransaction);
  }

  async createFinancialTransaction(
    transaction: Entities.CreateTransactionData,
  ): Promise<Entities.FinancialTransaction> {
    if (!transaction) return null;

    const transactionResult = await this.repository.save({
      transactionExternalId: uuiAdapter.generate(),
      accountExternalIdDebit: transaction.accountExternalIdDebit,
      accountExternalIdCredit: transaction.accountExternalIdCredit,
      value: transaction.value,
      status: transaction.transactionStatus,
      transactionType: transaction.transactionType,
    });

    let financialTransaction: Entities.FinancialTransaction = null;
    if (transactionResult) {
      financialTransaction = await this.repository.findOne({
        where: { id: transactionResult.id },
        relations: ['status', 'transactionType'],
      });
    }

    await this.kafkaProducerAdapter.sendMessage(financialTransaction);

    return financialTransaction;
  }
}

export const createFinancialTransactionDbAdapterProvider = {
  provide: Ports.FinancialTransactionPort,
  useClass: CreateFinancialTransactionAdapter,
};
