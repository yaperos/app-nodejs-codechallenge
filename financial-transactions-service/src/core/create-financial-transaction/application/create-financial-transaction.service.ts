import { Inject, Injectable } from '@nestjs/common';
import { Uuid } from '../../../shared/domain/value-object/Uuid';
import { Account } from '../domain/account';
import { FinancialTransaction } from '../domain/financial-transaction';
import { FinancialTransactionId } from '../domain/financial-transaction-id';
import { FinancialTransactionStatus } from '../domain/financial-transaction-status';
import { FinancialTransactionStatusEnum } from '../domain/financial-transaction-status.enum';
import { FinancialTransactionType } from '../domain/financial-transaction-type';
import { FinancialTransactionValue } from '../domain/financial-transaction-value';
import { FinancialTransactionsRepository } from '../domain/financial-transactions.repository';
import { CreateFinancialTransactionRequestDTO } from '../infrastructure/dto/create-financial-transaction-request.dto';

@Injectable()
export class CreateFinancialTransactionService {
  constructor(
    @Inject('FinancialTransactionsRepository')
    private readonly financialTransactionsRepository: FinancialTransactionsRepository,
  ) {}

  async handle(
    createFinancialTransactionRequestDTO: Readonly<CreateFinancialTransactionRequestDTO>,
  ): Promise<FinancialTransaction> {
    const financialTransactionId = new FinancialTransactionId(
      Uuid.random().toString(),
    );

    const financialTransactionValue = new FinancialTransactionValue(
      createFinancialTransactionRequestDTO.value,
    );

    const accountExternalDebit = new Account(
      new Uuid(createFinancialTransactionRequestDTO.accountExternalIdDebit),
    );
    const accountExternalCredit = new Account(
      new Uuid(createFinancialTransactionRequestDTO.accountExternalIdCredit),
    );

    const financialTransactionType = FinancialTransactionType.fromValue(
      createFinancialTransactionRequestDTO.transferTypeId,
    );
    const financialTransactionStatus = FinancialTransactionStatus.fromValue(
      FinancialTransactionStatusEnum.PENDING,
    );

    const financialTransaction = new FinancialTransaction(
      financialTransactionId,
      accountExternalDebit,
      accountExternalCredit,
      financialTransactionValue,
      financialTransactionType,
      financialTransactionStatus,
    );

    await this.financialTransactionsRepository.save(financialTransaction);

    return financialTransaction;
  }
}
