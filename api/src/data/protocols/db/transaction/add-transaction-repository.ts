import { ICreateRepository } from '../create-repository';
import { TransactionEntity } from '@domain/entities/transaction';

export type IAddTransactionRepository = ICreateRepository<
	TransactionEntity,
	TransactionEntity
>;
