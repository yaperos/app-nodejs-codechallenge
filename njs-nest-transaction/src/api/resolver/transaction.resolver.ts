import { Args, Mutation, Query, Resolver, Parent, ResolveField } from '@nestjs/graphql';

import { TransactionGraphQL } from "@api/entity/transaction.entity";
import { TransactionService, TypeService } from '@api/service';
import { TypeGraphQL } from '@api/entity/type.entity';
import { CreateTransactionGrqphQL } from '@api/dto';
import { Logger } from '@nestjs/common';
import { TransactionStatusGraphQL } from '@api/entity';

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

	// @Mutation(returns => TransactionGraphQL)
	// async findOneByNumericIdOrCreate(@Args('numericId') numericId: number) {
	// 	return this.typeService.findOneByNumericIdOrCreate(numericId);
	// }

	@Mutation(returns => TransactionGraphQL)
	async createTransaction(@Args('transaction') transaction: CreateTransactionGrqphQL) {
		Logger.log('transaction', transaction);
		return this.transactionService.create(transaction);
	}

	@Query(returns => TransactionGraphQL, { nullable: true })
	async findOne(@Args('details') details: TransactionStatusGraphQL) {
		return this.transactionService.findByStatusEntity(details);
	}

	@ResolveField(() => TypeGraphQL, { nullable: true })
  async type(@Parent() transaction: TransactionGraphQL) {
		const { tranferTypeId } = transaction;
		return this.typeService.findOneByNumericIdOrCreate(tranferTypeId);
  }
}
