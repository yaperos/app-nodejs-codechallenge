import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {TransactionService} from "./transaction.service";
import {CreateTransactionInput} from "../../../common/dto/create_transaction_input";
import {TransactionEntity} from "./entities/transaction.entity";
import {RetrieveTransaction} from "./entities/retrieve_transaction.entity";

@Resolver()
export class TransactionResolver {

    constructor(
        private transactionService: TransactionService,
    ) {}
    @Query( () => RetrieveTransaction, { description: 'iam a anti-fraud', name: 'findTransaction'} )
    async findTransaction(
        @Args('externalId', {type: () => String}) externalId: string
    ){
        return await this.transactionService.findTransaction(externalId)
    }

    @Mutation(returns => TransactionEntity , {  name: 'saveTransaction' } )
    async saveTransaction(@Args('createTransaction') createTransaction: CreateTransactionInput) {

        return await this.transactionService.createTransaction(createTransaction)

    }
}