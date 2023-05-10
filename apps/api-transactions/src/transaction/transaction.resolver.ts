import { Args, Query, Resolver } from '@nestjs/graphql';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';

@Resolver()
export class TransactionResolver {
  constructor(private transactionService: TransactionService) {}

  @Query(() => [Transaction])
  async transactions(): Promise<Transaction[]> {
    return this.transactionService.findAll();
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
