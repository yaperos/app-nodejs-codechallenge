import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction} from './transaction.entity'
import { CreateTransactionInput } from './dto/create-transaction.input';
import { TransactionStatus } from 'src/transaction-status/transaction-status.entity';

@Resolver()
export class TransactionResolver {
  constructor(private service: TransactionService) {}
  
  @Query((returns => [Transaction]))
  transacion() {
    console.log("transacion :)");
    return this.service.findAll();
  }

  @Mutation(returns => Transaction)
  createTransaction(@Args('transactionInput') transactionInput: CreateTransactionInput)
  {
    return this.service.createTransaction(transactionInput);
  }

  //@ResolveField(() => TransactionStatus)
   transactionStatus(@Parent() transacion: Transaction){
    console.log('***OJO**');
    console.log(transacion);
    return  this.service.getTransactionStatus(transacion.transactionStatusID);
  }
} 
