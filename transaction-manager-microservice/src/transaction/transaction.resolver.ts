import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent, Subscription } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { UpdateTransactionInput } from './dto/update-transaction.input';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@UsePipes(new ValidationPipe({transform: true}))
@Resolver(() => Transaction)
export class TransactionResolver {
	
	constructor(private readonly transactionService: TransactionService) {}

	@Mutation(() => Transaction)
	createTransaction(@Args('createTransactionInput') createTransactionInput: CreateTransactionInput){
		const createdTransaction = this.transactionService.createTransaction(createTransactionInput);
		//send to validation microservice;
		return createdTransaction;
	}

	@Query(() => Transaction, {
		description: `Retrieve transaction's info`,
		name: 'retrieveTransactionById',
		nullable: false,
		defaultValue: {
			value: true
		},
	})
	async retrieveTransactionById(@Args('id', { type: () => String }) transactionExternalId: string){
		return this.transactionService.retrieveTransactionById(transactionExternalId);
	}

	/*
	@Mutation(() => Transaction)
	createTransaction(@Args('createTransactionInput') createTransactionInput: CreateTransactionInput) {
		return this.transactionService.create(createTransactionInput);
	}

	@Query(() => [Transaction], { name: 'transaction' })
	findAll() {
		return this.transactionService.findAll();
	}

	@Query(() => Transaction, { name: 'transaction' })
	findOne(@Args('id', { type: () => Int }) id: number) {
		return this.transactionService.findOne(id);
	}

	@Mutation(() => Transaction)
	updateTransaction(@Args('updateTransactionInput') updateTransactionInput: UpdateTransactionInput) {
		return this.transactionService.update(updateTransactionInput.id, updateTransactionInput);
	}

	@Mutation(() => Transaction)
	removeTransaction(@Args('id', { type: () => Int }) id: number) {
		return this.transactionService.remove(id);
	}
	*/
}
