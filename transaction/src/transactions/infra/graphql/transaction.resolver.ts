import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { TransactionService } from '../../app/transaction.service';
import { TransactionEntity } from "../../domain/entities/transaction.entity";
import { TransactionCreateDto } from "../../app/dto/transaction.dto";

@Resolver()
export class TransactionResolver{

    constructor(private transactionService: TransactionService){

    }

    @Query((returns) => TransactionEntity)
    findTransactionById(@Args('id', {type:()=>Int}) id:number){
        return this.transactionService.findTransactionById(id);
    }

    @Mutation((returns) => TransactionEntity)
    async createTransaction(@Args('body') body: TransactionCreateDto ){
        const response = await this.transactionService.create(body);
        await this.transactionService.sendTransaction(response);

        return response;

    }
}