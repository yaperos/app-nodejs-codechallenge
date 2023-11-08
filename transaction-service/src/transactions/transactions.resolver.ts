import { Resolver, Query, Mutation, Args} from '@nestjs/graphql';
import { TransactionsService } from './transactions.service';
import { RetrieveTransaction } from './post.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { DeleteResult } from 'typeorm';

@Resolver()
export class TransactionsResolver {

    constructor(private transactionService :TransactionsService){}

    @Query(() => RetrieveTransaction)
    retrieveTransaction(@Args('transactionExternalId')id: string){
        return this.transactionService.retrieve(id)
    }

    @Query(() => [RetrieveTransaction])
    retrieveTransactionAll(){
        return this.transactionService.retrieveAll()
    }

    @Query(() => RetrieveTransaction)
    async deleteTransaction(@Args('transactionExternalId')id: string){
        const deleted = await this.transactionService.delete(id)

        return deleted.raw
    }


    @Mutation(() => RetrieveTransaction)
    createTransaction(@Args('createTransaction') createTransaction : CreateTransactionInput){
        return this.transactionService.transaction(createTransaction)
    }
}
