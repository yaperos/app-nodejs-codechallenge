import { Injectable } from '@nestjs/common';
import { Ports, Entities } from 'src/domain/financial-transactions/view';
import { InjectRepository } from '@nestjs/typeorm';
import { FinancialTransaction } from '../../../infra/db/entities/financial-transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ViewFinancialTransactionAdapter implements Ports.FinancialTransactionPort {
  constructor(
    @InjectRepository(FinancialTransaction)
    private readonly financialTransactionRepository: Repository<FinancialTransaction>,
  ) {}

  async getByFilter(filters: Entities.FinancialTransactionFilters): Promise<Entities.FinancialTransaction> {
    if (!filters) return null;

    console.log(filters);

    const financialTransaction = await this.financialTransactionRepository.findOne({
      where: { ...filters },
      relations: ['status', 'transactionType'],
    });

    console.log(financialTransaction);

    if (!financialTransaction) return null;

    return financialTransaction;
  }
}

export const viewFinancialTransactionDbAdapterProvider = {
  provide: Ports.FinancialTransactionPort,
  useClass: ViewFinancialTransactionAdapter,
};
