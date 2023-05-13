import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TransactionsService } from './transactions.service';
import { CreateTransactionInput } from '../../../../src/graphql';

@Resolver('Transaction')
export class TransactionsResolver {

    constructor(private readonly transactionsService: TransactionsService) { }

    @Query('findTransaction')
    async transactions( @Args('externalId', {type: () => Number}) externalId: number) {
        return this.transactionsService.find(externalId);
    }

    @Mutation('saveTransaction')
    async saveTransaction(@Args('data') input : CreateTransactionInput){
        console.log("aqui");
        return this.transactionsService.saveTransaction(input);
    }

}