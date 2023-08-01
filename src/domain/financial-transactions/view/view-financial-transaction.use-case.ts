import { Injectable } from '@nestjs/common';
import { FinancialTransactionPort } from './view-financial-transaction.ports';
import { FinancialTransactionFilters, FinancialTransactionResponse } from './view-fiinancial-transaction.entities';
import { InvalidTransactionFiltersError } from './errors/invalid-transaction-filters.error';

@Injectable()
export class ViewFinancialTransaction {
  constructor(private readonly financialTransactionPort: FinancialTransactionPort) {}

  async execute(request: FinancialTransactionFilters): Promise<FinancialTransactionResponse> {
    const { id, transactionExternalId } = request;

    if (!id && !transactionExternalId) {
      throw new InvalidTransactionFiltersError();
    }

    return await this.getFinancialTransaction({ id, transactionExternalId });
  }

  private async getFinancialTransaction(request: FinancialTransactionFilters): Promise<FinancialTransactionResponse> {
    const filters: FinancialTransactionFilters = {};

    if (request.id) {
      filters.id = request.id;
    } else if (request.transactionExternalId) {
      filters.transactionExternalId = request.transactionExternalId;
    }

    const financialTransaction = await this.financialTransactionPort.getByFilter(filters);

    return {
      transactionExternalId: financialTransaction.transactionExternalId,
      transactionType: {
        name: financialTransaction.transactionType.type,
      },
      transactionStatus: {
        name: financialTransaction.status.status,
      },
      value: financialTransaction.value,
      createdAt: financialTransaction.createdAt.toISOString(),
      transactionId: financialTransaction.id,
    };
  }
}
