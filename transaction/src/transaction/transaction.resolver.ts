import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';
import { CreateTransactionGraphqlDto } from './dto/create-transaction.graphql.dto';

@Resolver()
export class TransactionResolver {
  constructor(private transactionService: TransactionService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation((returns) => TransactionEntity)
  create(@Args('input') transactionInput: CreateTransactionGraphqlDto) {
    return this.transactionService.saveTransactionGraphql(transactionInput);
  }
}
