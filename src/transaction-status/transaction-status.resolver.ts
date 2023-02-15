import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransactionStatusService } from './transaction-status.service';
import { TransactionStatus } from './transaction-status.entity';
import { CreateTransactionStatusInput } from './dto/create-transaction-status.input';
import { UpdateTransactionStatusInput } from './dto/update-transaction-status.input';

@Resolver(() => TransactionStatus)
export class TransactionStatusResolver {
  constructor(private readonly service: TransactionStatusService) {}

  @Mutation(() => TransactionStatus)
  createTransactionStatus(@Args('transactionStatusInput') transactionStatusInput: CreateTransactionStatusInput)
  {
    console.log(transactionStatusInput);
    return this.service.createTransaction(transactionStatusInput);
  }

  @Query((returns) => [TransactionStatus], { name: 'transactionStatus' })
  transactionStatus() {
    console.log("TransactionStatus :)");
    return this.service.findAll(); 
  }


  @Query(() => TransactionStatus, { name: 'transactionStatusByID' })
  findOne(@Args('id') id: string) {
    return this.service.findOne(id);
  }
}
