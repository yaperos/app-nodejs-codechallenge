import { TransactionEntity } from '@domain/entities/transaction';
import { Either } from '@domain/logic/Either';
import { IUseCase } from '@domain/protocols/use-case';

type AddTransactionModel = {
	accountExternalIdDebit: string;
	accountExternalIdCredit: string;
	transferTypeId: number;
	value: number;
};

type AddTransactionUseCaseResult = Either<Error, TransactionEntity>;

type IAddTransactionUseCase = IUseCase<AddTransactionModel, AddTransactionUseCaseResult>;

export { AddTransactionModel, AddTransactionUseCaseResult, IAddTransactionUseCase };
