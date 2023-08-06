import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { CreateTransactionGrqphQL } from '@api/dto';
import { TransactionStatusGraphQL } from '@api/entity';
import { TransactionGraphQL } from "@api/entity/transaction.entity";
import { TypeGraphQL } from '@api/entity/type.entity';
import { TransactionService, TypeService } from '@api/service';
import { Logger } from '@nestjs/common';

@Resolver(of => TransactionGraphQL)
export class TransactionResolver {
	constructor(
		private transactionService: TransactionService,
		private typeService: TypeService,
	) { }
	
	@Query(returns => [TransactionGraphQL])
	async allTransactions() {
		return this.transactionService.findAll();
	}

	@Mutation(returns => TransactionGraphQL)
	async createTransaction(@Args('transaction') transaction: CreateTransactionGrqphQL) {
		Logger.log('transaction', transaction);
		return this.transactionService.create(transaction);
	}

	@Query(returns => TransactionGraphQL, { nullable: true })
	async findTransaction(@Args('details') details: TransactionStatusGraphQL) {
		return this.transactionService.findByStatusEntity(details);
	}

	@ResolveField(() => TypeGraphQL, { nullable: true })
  async type(@Parent() transaction: TransactionGraphQL) {
		const { tranferTypeId } = transaction;
		return this.typeService.findOneByNumericIdOrCreate(tranferTypeId);
  }
}
