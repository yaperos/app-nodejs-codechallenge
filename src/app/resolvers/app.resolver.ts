import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AppService } from '../services/app.service';
import { CreateTransactionGqlDto } from '../DTOs/createTransactionGql.dto';
import { ResponseCreateTransactionGlqDto } from '../DTOs/responseCreateTransactionGql.dto';
import { ResponseLastTransactionGqlDto } from '../DTOs/responseLastTransactionGql.dto';
import { RequestTransactionDto } from '../DTOs/requestTransaction.dto';

@Resolver()
export class AppResolver {
    constructor(
        private appService: AppService
    ) {}

    @Query(returns => String)
    sayHello(): string {
        return 'Hello World!';
    }

    @Mutation(returns => ResponseLastTransactionGqlDto)
    async getLastTransaction(
        @Args('input') input: RequestTransactionDto,
    ) {
        return this.appService.getLastTransaction(input);
    }
    
    @Mutation(returns => ResponseCreateTransactionGlqDto)
    async createTransaction(
        @Args('input') input: CreateTransactionGqlDto,
    ) {
        return this.appService.create(input);
    }
}