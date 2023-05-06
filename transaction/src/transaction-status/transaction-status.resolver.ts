import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransactionStatusService } from './transaction-status.service';
import { TransactionStatus } from './entities/transaction-status.entity';
import { CreateTransactionStatusInput } from './dto/create-transaction-status.input';
import { UpdateTransactionStatusInput } from './dto/update-transaction-status.input';

@Resolver(() => TransactionStatus)
export class TransactionStatusResolver {
  constructor(
    private readonly transactionStatusService: TransactionStatusService,
  ) {}

  @Mutation(() => TransactionStatus)
  createTransactionStatus(
    @Args('createTransactionStatusInput')
    createTransactionStatusInput: CreateTransactionStatusInput,
  ) {
    return this.transactionStatusService.create(createTransactionStatusInput);
  }

  @Query(() => [TransactionStatus], { name: 'transactionStates' })
  findAll() {
    return this.transactionStatusService.findAll();
  }

  @Query(() => TransactionStatus, { name: 'transactionStatus' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.transactionStatusService.findOne(id);
  }

  @Mutation(() => TransactionStatus)
  updateTransactionStatus(
    @Args('updateTransactionStatusInput')
    updateTransactionStatusInput: UpdateTransactionStatusInput,
  ) {
    return this.transactionStatusService.update(
      updateTransactionStatusInput.id,
      updateTransactionStatusInput,
    );
  }
}
