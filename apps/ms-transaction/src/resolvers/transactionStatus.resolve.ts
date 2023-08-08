import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionStatus } from '../models';
import { TransactionStatusService } from '../services';
import { CreateTransactionStatusDto } from '../dto';

@Resolver((of) => TransactionStatus)
export class TransactionStatusResolver {
  constructor(
    private readonly transactionStatusService: TransactionStatusService,
  ) {}

  @Query((returns) => [TransactionStatus])
  transactionsStatus(): Promise<TransactionStatus[]> {
    return this.transactionStatusService.findAll();
  }

  @Query(() => TransactionStatus, { name: 'transactionStatusFindOne' })
  findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<TransactionStatus> {
    return this.transactionStatusService.findOne(id);
  }

  @Mutation((returns) => TransactionStatus)
  createTransactionStatus(
    @Args('createTransactionStatusInput')
    createTransactionStatusInput: CreateTransactionStatusDto,
  ): Promise<TransactionStatus> {
    return this.transactionStatusService.save(createTransactionStatusInput);
  }
}
