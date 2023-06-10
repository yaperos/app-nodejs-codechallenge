import { Inject, Injectable } from '@nestjs/common';
import { FinancialTransactionId } from '../../create-financial-transaction/domain/financial-transaction-id';
import { FinancialTransactionStatus } from '../../create-financial-transaction/domain/financial-transaction-status';
import { FinancialTransactionsRepository } from '../../create-financial-transaction/domain/financial-transactions.repository';

@Injectable()
export class UpdateFinancialTransactionStatusService {
  constructor(
    @Inject('FinancialTransactionsRepository')
    private readonly financialTransactionsRepository: FinancialTransactionsRepository,
  ) {}

  async handle(
    id: FinancialTransactionId,
    financialTransactionStatus: FinancialTransactionStatus,
  ): Promise<boolean> {
    const affectedRows =
      await this.financialTransactionsRepository.updateStatus(
        id,
        financialTransactionStatus,
      );

    return affectedRows > 0;
  }
}
