/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';

import { CommandHandlers } from '../../../Contexts/Shared/infrastructure/CommandBus/CommandHandlers';
import { InMemoryCommandBus } from '../../../Contexts/Shared/infrastructure/CommandBus/InMemoryCommandBus';
import { TypeOrmClientFactory } from '../../../Contexts/Shared/infrastructure/persistence/typeorm/TypeOrmClientFactory';
import { TypeOrmConfigFactory } from '../../../Contexts/Transaction/Shared/infrastructure/persistence/postgres/TypeOrmConfigFactory';
import { CreateTransactionCommandHandler } from '../../../Contexts/Transaction/Transactions/application/CreateTransactionCommandHandler';
import { TransactionCreator } from '../../../Contexts/Transaction/Transactions/application/TransactionCreator';
import { TypeOrmTransactionRepository } from '../../../Contexts/Transaction/Transactions/infrastructure/persistence/TypeOrmTransactionRepository';
import { TransactionsPostController } from '../controllers/TransactionsPostController';
import { validateReqSchema } from '.';

export const register = (router: Router): any => {
	const reqSchema = [
		body('accountExternalIdDebit').exists().isUUID(),
		body('accountExternalIdCredit').exists().isUUID(),
		body('tranferTypeId').exists().isNumeric(),
		body('value').exists().isNumeric()
	];
	const config = TypeOrmConfigFactory.createConfig();
	const connection = TypeOrmClientFactory.createClient('transaction', config);
	const transactionRepository = new TypeOrmTransactionRepository(connection);
	const transactionCreator = new TransactionCreator(transactionRepository);
	const commandHandlers = new CommandHandlers([
		new CreateTransactionCommandHandler(transactionCreator)
	]);
	const commandBus = new InMemoryCommandBus(commandHandlers);
	const transactionPostController = new TransactionsPostController(commandBus);
	router.post('/transactions', reqSchema, validateReqSchema, (req: Request, res: Response): any =>
		transactionPostController.run(req, res)
	);
};
