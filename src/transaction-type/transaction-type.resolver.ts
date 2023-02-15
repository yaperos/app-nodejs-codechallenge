import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TransactionTypeService } from './transaction-type.service';
import { TransactionType } from './transaction-type.entity';
import { CreateTransactionTypeInput } from './dto/create-transaction-type.input';
import { UpdateTransactionTypeInput } from './dto/update-transaction-type.input';

@Resolver(() => TransactionType)
export class TransactionTypeResolver {
  constructor(private readonly service: TransactionTypeService) {}

  @Mutation(() => TransactionType)
  createTransactionType(@Args('transactionTypeInput') transactionTypeInput: CreateTransactionTypeInput) 
  {
    console.log(transactionTypeInput);
    return this.service.createTransaction(transactionTypeInput);
  }

  @Query(() => [TransactionType], { name: 'transactionType' })
  transactionType() {
    return this.service.findAll();
  }

  @Query(() => TransactionType, { name: 'transactionTypeByID' })
  findOne(@Args('id') id: string) {
    return this.service.findOne(id);
  }
} 
