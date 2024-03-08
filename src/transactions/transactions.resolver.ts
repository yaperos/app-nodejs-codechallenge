import { Resolver, Query, Mutation, Args} from '@nestjs/graphql';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.entity'
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ResponseTransactionDto } from './dto/response-transaction.dto';

@Resolver()
export class TransactionsResolver {

	constructor(private transactionService: TransactionsService){}
	

	@Query((returns) => [Transaction])
	transactions(){
		return this.transactionService.getAll();
	}

	@Query((returns) => Transaction)
	async transaction(@Args('transactionExternalId') transactionExternalId: string){
		const transaction = this.transactionService.get(transactionExternalId)
		return new ResponseTransactionDto(await transaction);
	}

	@Mutation((returns) => Transaction)
	createTransaction(@Args('transaction') transaction: CreateTransactionDto){
		return this.transactionService.create(transaction);
	}
}
