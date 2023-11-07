import { Resolver, Query, Mutation, Args} from '@nestjs/graphql';
import { TransactionsService } from './transactions.service';
import { RetrieveTransaction } from './post.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';

@Resolver()
export class TransactionsResolver {

    constructor(private transactionService :TransactionsService){}

    @Query(() => RetrieveTransaction)
    retrieveTransaction(@Args('transactionExternalId')id: string){
        return this.transactionService.retrieve(id)
    }

    @Mutation(() => RetrieveTransaction)
    createTransaction(@Args('createTransaction') createTransaction : CreateTransactionInput){
        return this.transactionService.transaction(createTransaction)
    }
}
