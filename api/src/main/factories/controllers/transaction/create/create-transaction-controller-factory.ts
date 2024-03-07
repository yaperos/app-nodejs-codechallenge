import { CreateTransactionController } from '@presentation/controllers/transaction/create-transaction-controller';
import { IController } from '@presentation/protocols';
import { makeCreateTransactionValidation } from './create-transaction-validation-factory';
import { makeAddTransactionUseCase } from 'main/factories/usecases/transaction/create-transaction-use-case-factory';
import { LogControllerDecorator } from 'main/decorators/log-controller-decorator';
import { LogRepository } from '@infra/db/prisma/repositories/log/log-error-repository';

export const makeCreateTransactionController = (): IController => {
	const controller = new CreateTransactionController(
		makeCreateTransactionValidation(),
		makeAddTransactionUseCase()
	);

	return new LogControllerDecorator(controller, new LogRepository());
};
