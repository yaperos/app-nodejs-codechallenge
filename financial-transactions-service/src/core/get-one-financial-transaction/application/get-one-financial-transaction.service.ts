import { Inject, Injectable } from '@nestjs/common';
import { FinancialTransaction } from '../../create-financial-transaction/domain/financial-transaction';
import { FinancialTransactionId } from '../../create-financial-transaction/domain/financial-transaction-id';
import { FinancialTransactionsRepository } from '../../create-financial-transaction/domain/financial-transactions.repository';

@Injectable()
export class GetOneFinancialTransactionService {
  constructor(
    @Inject('FinancialTransactionsRepository')
    private readonly financialTransactionsRepository: FinancialTransactionsRepository,
  ) {}

  async handle(id: Readonly<string>): Promise<FinancialTransaction> {
    const financialTransaction =
      await this.financialTransactionsRepository.findOne(
        new FinancialTransactionId(id),
      );

    return financialTransaction;
  }
}
