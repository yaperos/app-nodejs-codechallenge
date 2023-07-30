import { Injectable } from '@nestjs/common';
import { DbTransactionPort } from '../../_shared/ports/db-transaction-port';
import {
  FinancialTransactionPort,
  TransactionStatusPort,
  TransactionTypePort,
} from './create-financial-transaction.ports';
import {
  CreateTransactionRequest,
  CreateTransactionResponse,
  StatusType,
} from './create-financial-transaction.entities';
import { InvalidTransactionTypeError } from './errors/invalid-transaction-type.error';

@Injectable()
export class CreateFinancialTransaction {
  constructor(
    private dbTransactionPort: DbTransactionPort,
    private readonly financialTransactionPort: FinancialTransactionPort,
    private readonly transactionStatusPort: TransactionStatusPort,
    private readonly transactionTypePort: TransactionTypePort,
  ) {}

  async execute(request: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    try {
      await this.dbTransactionPort.startTransaction();
      const financialTransaction = await this.createFinancialTransaction(request);
      await this.dbTransactionPort.commitTransaction();
      return financialTransaction;
    } catch (error) {
      await this.dbTransactionPort.rollbackTransaction();
      throw error;
    }
  }

  private async createFinancialTransaction(request: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    const { value, transactionType } = request;

    const transactionTypeId = await this.transactionTypePort.getTransactionTypeByName(transactionType);

    if (!transactionTypeId) {
      throw new InvalidTransactionTypeError();
    }

    const transactionStatusId = await this.transactionStatusPort.getTransactionStatusByName(StatusType.PENDING);

    const financialTransaction = await this.financialTransactionPort.createFinancialTransaction({
      value,
      transactionType: transactionTypeId,
      transactionStatus: transactionStatusId,
    });

    return {
      description: 'Transaction created correctly',
      status: StatusType.PENDING,
      transactionId: financialTransaction.id,
    };
  }
}
