import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateTransactionDto } from 'src/transactions/infrastructure/in/dtos/create-transaction.dto';
import { TransactionsManagerService } from 'src/transactions/application/transactions-manager.service';
import { TransactionModel } from 'src/transactions/infrastructure/out/transaction.model';
import { GetTransactionDto } from 'src/transactions/infrastructure/in/dtos/get-transaction.dto';
import { CreateTransactionUseCase } from 'src/transactions/application/create-transaction-use-case';
import { AccountExternalIdDebit } from 'src/transactions/domain/AccountExternalIdDebit';
import { AccountExternalIdCredit } from 'src/transactions/domain/AccountExternalIdCredit';
import { TransferTypeId } from 'src/transactions/domain/TransferTypeId';
import { CreateTransactionCommand } from 'src/transactions/application/create-transaction-command';
import { TransactionPrimitives } from 'src/transactions/domain/Transaction';

@Resolver()
export class TransactionsResolver {
  constructor(
    private readonly ts: TransactionsManagerService,
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  @Mutation(() => TransactionModel)
  createTransaction(@Args('input') dto: CreateTransactionDto): Promise<TransactionPrimitives> {
    const accountExternalIdDebit = new AccountExternalIdDebit(dto.accountExternalIdDebit);
    const accountExternalIdCredit = new AccountExternalIdCredit(dto.accountExternalIdCredit);
    const transferTypeId = new TransferTypeId(dto.transferTypeId);

    return this.createTransactionUseCase.createTransaction(
      new CreateTransactionCommand(accountExternalIdDebit, accountExternalIdCredit, transferTypeId, dto.value),
    );
  }

  @Query(() => TransactionModel)
  getTransaction(@Args('input') dto: GetTransactionDto): Promise<TransactionPrimitives> {
    return this.ts.getTransaction(dto);
  }
}
