import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Resolver()
export class TransactionResolver {
  constructor(private transactionService: TransactionService) {}

  @Query(() => [Transaction])
  async transactions(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }

  @Mutation(() => Transaction)
  createPost(@Args('transactionInput') transactionInput: CreateTransactionDto) {
    return this.transactionService.createTransactions(transactionInput);
  }

  //   @Query(() => String, { description: 'Retorna un saludo' })
  //   helloWorld(): string {
  //     return 'hola mundo';
  //   }

  //   @Query(() => String)
  //   getTransaction(@Args('ext_id') transactionId: string): string {
  // @Args('ext_id',{type:()=>Int})
  // @Args('ext_id',{type:()=>Int,nullable:true})
  // return 'aqui una transaction';
  //   }
}
