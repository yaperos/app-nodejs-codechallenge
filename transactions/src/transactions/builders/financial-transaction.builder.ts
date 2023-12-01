import { CreateFinancialTransactionDTO } from '@/transactions/dto/create-financial-transaction.dto';
import { FinancialTransaction } from '@/transactions/entities/financial-transaction.entity';
import { FinancialTransactionType } from '@/transactions/entities/financial-transaction-type.entity';

export class FinancialTransactionBuilder {
  static fromCreateDTO = (
    dto: CreateFinancialTransactionDTO,
  ): Partial<FinancialTransaction> => {
    return {
      ...dto,
      transactionType: {
        transactionTypeId: dto.tranferTypeId,
      } as FinancialTransactionType,
    };
  };
}
