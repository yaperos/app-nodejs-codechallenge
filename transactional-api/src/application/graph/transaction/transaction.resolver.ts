import { Inject } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { Transaction } from 'src/domain/entities/transaction.entity';
import { ITransactionRepository } from 'src/domain/interfaces/itransaction.repository';
import { TransactionRepository } from 'src/infrastructure/repositories/transaction/transaction.repository';

@Resolver()
export class TransactionResolver {

    constructor(
        @Inject(TransactionRepository) 
        private readonly transactionRepository: ITransactionRepository,
      ) {}

    @Query(returns => Transaction)
    async getTransaction(@Args('transactionExternalId') transactionExternalId: string): Promise<Transaction>{
        return this.transactionRepository.findOneAsync(transactionExternalId);
    }

    @Query(returns => [Transaction])
    async transactions(): Promise<Transaction[]>{
        return this.transactionRepository.findAllAsync()
    }
}
