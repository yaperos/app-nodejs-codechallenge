import { Injectable } from '@nestjs/common';
import { CreateFinancialTransactionDTO } from './dto/create-financial-transaction.dto';
import { FinancialTransaction } from './interfaces/financial-transaction.interface';

@Injectable()
export class FinancialTransactionsService {
  create(
    transaction: CreateFinancialTransactionDTO,
  ): CreateFinancialTransactionDTO {
    return transaction;
  }

  findAll(): FinancialTransaction[] {
    return [];
  }
}
