import { Resolver,Query,Mutation,Args } from '@nestjs/graphql';
import { CreateTransactionInputDto } from '../dto/create-post.input';
import { Transaction } from '../entities/transaction.entity';
import { TransactionsService } from '../services/transactions.service';

@Resolver('Transaction')
export class TransactionsResolver {
    constructor(private readonly transactionService: TransactionsService){}

    @Query((returns)=> Transaction)
    async getTransaction(@Args('transactionExternalId') transactionExternalId:string){
        return await this.transactionService.findByIdTransaction(transactionExternalId)
    }

    @Mutation((returns) => Transaction)
    async createTransaction(@Args('data') data:CreateTransactionInputDto){
        return  await this.transactionService.createTransaction(data);
    }
}
