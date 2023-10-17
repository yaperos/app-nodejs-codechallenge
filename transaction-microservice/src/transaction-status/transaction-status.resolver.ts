import { Resolver, Query, Mutation, Args, Int} from '@nestjs/graphql';
import { TransactionStatusService } from './transaction-status.service';
import { TransactionStatus } from './entities/transaction-status.entity';
import { CreateTransactionStatusInput } from './dto/create-transaction-status.input';
import { UpdateTransactionStatusInput } from './dto/update-transaction-status.input';

@Resolver(() => TransactionStatus)
export class TransactionStatusResolver {
  constructor(private readonly transactionStatusService: TransactionStatusService) {}

  @Mutation(() => TransactionStatus)
  createTransactionStatus(@Args('createTransactionStatusInput') createTransactionStatusInput: CreateTransactionStatusInput) {
    return this.transactionStatusService.create(createTransactionStatusInput);
  }

  @Query(() => [TransactionStatus], { name: 'transactionStatuss' })
  findAllTransactionStatus() {
    return this.transactionStatusService.findAll();
  }

  @Query(() => TransactionStatus, { name: 'transactionStatusbyId' })
  findOneTransactionStatusbyId(@Args('id', { type: () => Int }) id: number) {
    return this.transactionStatusService.findOneById(id);
  }
  @Query(() => TransactionStatus, { name: 'transactionStatusbyName' })
  findOneTransactionStatusbyName(@Args('name', { type: () => String}) name: string) {
    return this.transactionStatusService.findOneByName(name);
  } 
}
