import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { TransactionPresenter } from "./transaction.presenter";
import { TransactionDto } from "./transaction.dto";
import { SaveTransactionUseCase } from "apps/yape/src/core/use-case/transaction/save-transaction.usecase";
import { AntiFraudService } from "../../service/anti-fraud.service";
import { GetTransactionUseCase } from "apps/yape/src/core/use-case/transaction/get-transaction.usecase";
import { TransactionTypePresenter } from "./transaction-type.presenter";
import { TransactionStatePresenter } from "./transaction-state.presenter";
import { DataLoaderService } from "../../service/data-loader.service";

@Resolver(() => TransactionPresenter)
export class TransactionResolver {

  constructor(private readonly antiFraudService: AntiFraudService,
    private readonly saveTransactionUseCase: SaveTransactionUseCase,
    private readonly getTransactionUseCase: GetTransactionUseCase,
    private readonly dataLoaderService: DataLoaderService) { }

  @Query(() => TransactionPresenter, { name: 'transaction' })
  getTransaction(@Args('transactionId') transactionId: string) {
    return this.getTransactionUseCase.getTransaction(transactionId);
  }

  @ResolveField(() => TransactionTypePresenter, { name: 'transactionType' })
  getTransactionType(@Parent() transactionPresenter: TransactionPresenter) {
    return this.dataLoaderService.getTransactionType(transactionPresenter.transactionType.id);
  }

  @ResolveField(() => TransactionStatePresenter, { name: 'transactionStatus' })
  getTransactionState(@Parent() transactionPresenter: TransactionPresenter) {
    return this.dataLoaderService.getTransactionState(transactionPresenter.transactionStatus.id);
  }

  @Mutation(() => TransactionPresenter)
  async insertTransaction(@Args('transactionDto') transactionDto: TransactionDto) {
    let transaction = await this.saveTransactionUseCase.insert(transactionDto);
    this.antiFraudService.sendTransactionToEvaluate(transaction);
    return transaction;
  }

}