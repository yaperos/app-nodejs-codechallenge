import { Resolver, Query, Mutation, Args} from '@nestjs/graphql';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { RetrieveTransaction } from '../domain/transaction.entity';
import { ITransactionsServiceUseCase } from '../aplication/transactionUseCases';
import { Inject } from '@nestjs/common';

@Resolver()
export class TransactionsResolver {

    constructor(@Inject('ITransactionsServiceUseCase') private transactionService :ITransactionsServiceUseCase){}

    @Query(() => RetrieveTransaction)
    retrieveTransaction(@Args('transactionExternalId')id: string){
        return this.transactionService.retrieveTransaction(id)
    }

    @Query(() => [RetrieveTransaction])
    retrieveTransactionAll(){
        return this.transactionService.retrieveAll()
    }

    @Mutation(() => RetrieveTransaction)
    createTransaction(@Args('createTransaction') createTransaction : CreateTransactionInput){
        return this.transactionService.transaction(createTransaction)
    }
}
