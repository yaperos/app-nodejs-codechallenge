import { CreateTransactionController } from '@presentation/controllers/transaction/create-transaction-controller';
import { IController } from '@presentation/protocols';
import { makeCreateTransactionValidation } from './create-transaction-validation-factory';
import { makeAddTransactionUseCase } from 'main/factories/usecases/transaction/create-transaction-use-case-factory';

export const makeCreateTransactionController = (): IController => {
	return new CreateTransactionController(
		makeCreateTransactionValidation(),
		makeAddTransactionUseCase()
	);
};
