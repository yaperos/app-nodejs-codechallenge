import { Resolver, Mutation, Args, Int, ResolveField, Parent} from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Query } from '@nestjs/graphql';
import { Transaction } from './transaction.entity';
import { CreateTransactionInput} from './dto/create-transaction.input';
import { UpdateTransactionInput} from './dto/update-transaction.input';
import { TranferType } from 'src/tranfer-type/entities/tranfer-type.entity';
import { TransactionStatus } from 'src/transaction-status/entities/transaction-status.entity';

@Resolver((of)=>Transaction)
export class TransactionResolver {
    constructor(
        private transactionService:TransactionService
        ){}
    
    
    @Query((returns)=>[Transaction])
    getAllTransacion() {
        return this.transactionService.findAll();
    }
    
    @Query((returns)=>Transaction)
    getOneTransacion(@Args('id', {type:()=>Int}) id:number) {
        return this.transactionService.findTransactionById(id);
    }
 
    @Mutation((returns)=>Transaction)
    createTransacion(@Args('createTransactionInput')createTransactionInput:CreateTransactionInput) {
       return this.transactionService.createTransaction(createTransactionInput);
    }

    @Mutation(() => Transaction)
    updateTransaction(@Args('updateTransactionInput') updateTransactionInput: UpdateTransactionInput) {
      return this.transactionService.update(updateTransactionInput.id, updateTransactionInput);
    }

    //sub query to linked entities the transaction entity
    @ResolveField((returns)=>Transaction)
    tranferType(@Parent() transaction:Transaction):Promise<TranferType> {
        return this.transactionService.getTranferType(transaction.tranferTypeId);
    }

    @ResolveField((returns)=> Transaction)
    transactionStatus(@Parent() transaction:Transaction): Promise<TransactionStatus>{
        return this.transactionService.getTransactionStatus(transaction.transactionStatusId);
    }
}
