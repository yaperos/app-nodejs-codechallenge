import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction} from './transaction.entity'
import { CreateTransactionInput } from './dto/create-transaction.input';
import { TransactionStatus } from 'src/transaction-status/transaction-status.entity';
import { TransactionType } from 'src/transaction-type/transaction-type.entity';
import { UpdateTransactionInput } from './dto/Update-transaction.input';


@Resolver((of) => Transaction)
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

  @Mutation((returns) => Transaction)
  updateTransaction(@Args('updatetransactionInput') updatetransactionInput: UpdateTransactionInput)
  {
    return this.service.updateTransaction(updatetransactionInput.transactionExternalId, updatetransactionInput)
  }

  @ResolveField((returns) => TransactionStatus)
   transactionStatus(@Parent() transacion: Transaction): Promise<TransactionStatus>{
    
    console.log(transacion);
    return  this.service.getTransactionStatus(transacion.transactionStatusID);
  }

  @ResolveField((returns) => TransactionType)
 transactionType(@Parent() transacion: Transaction): Promise<TransactionType>{
  
  console.log(transacion);
  return  this.service.getTransactionType(transacion.transacionTypeId);
}
}
