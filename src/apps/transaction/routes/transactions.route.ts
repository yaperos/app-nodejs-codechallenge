/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, Router } from 'express';
import { body, param } from 'express-validator';

import { CommandHandlers } from '../../../Contexts/Shared/infrastructure/CommandBus/CommandHandlers';
import { InMemoryCommandBus } from '../../../Contexts/Shared/infrastructure/CommandBus/InMemoryCommandBus';
import { KafkaConnection } from '../../../Contexts/Shared/infrastructure/EventBus/Kafka/KafkaConnection';
import { TypeOrmClientFactory } from '../../../Contexts/Shared/infrastructure/persistence/typeorm/TypeOrmClientFactory';
import { InMemoryQueryBus } from '../../../Contexts/Shared/infrastructure/QueryBus/InMemoryQueryBus';
import { QueryHandlers } from '../../../Contexts/Shared/infrastructure/QueryBus/QueryHandlers';
import { KafkaConfigFactory } from '../../../Contexts/Transaction/Shared/infrastructure/Kafka/KafkaConfigFactory';
import { KafkaEventBusFactory } from '../../../Contexts/Transaction/Shared/infrastructure/Kafka/KafkaEventBusFactory';
import { TypeOrmConfigFactory } from '../../../Contexts/Transaction/Shared/infrastructure/persistence/postgres/TypeOrmConfigFactory';
import { CreateTransactionCommandHandler } from '../../../Contexts/Transaction/Transactions/application/CreateTransactionCommandHandler';
import { FindTransactionQueryHandler } from '../../../Contexts/Transaction/Transactions/application/FindTransactionQueryHandler';
import { TransactionCreator } from '../../../Contexts/Transaction/Transactions/application/TransactionCreator';
import { TransactionFinder } from '../../../Contexts/Transaction/Transactions/application/TransactionFinder';
import { TypeOrmTransactionRepository } from '../../../Contexts/Transaction/Transactions/infrastructure/persistence/TypeOrmTransactionRepository';
import {
	FindTransactionRequest,
	TransactionGetController
} from '../controllers/TransactionsGetController';
import { TransactionsPostController } from '../controllers/TransactionsPostController';
import { validateReqSchema } from '.';

export const register = (router: Router) => {
	const kafkaConfig = KafkaConfigFactory.createConfig();
	const kafkaConnection = new KafkaConnection(kafkaConfig);
	const eventBus = KafkaEventBusFactory.create(kafkaConnection, kafkaConfig);
	kafkaConnection.connect();

	const config = TypeOrmConfigFactory.createConfig();
	const connection = TypeOrmClientFactory.createClient('transaction', config);
	const transactionRepository = new TypeOrmTransactionRepository(connection);
	const transactionCreator = new TransactionCreator(transactionRepository, eventBus);
	const commandHandlers = new CommandHandlers([
		new CreateTransactionCommandHandler(transactionCreator)
	]);
	const commandBus = new InMemoryCommandBus(commandHandlers);
	const transactionPostController = new TransactionsPostController(commandBus);
	router.post(
		'/transactions',
		[
			body('accountExternalIdDebit').exists().isUUID(),
			body('accountExternalIdCredit').exists().isUUID(),
			body('tranferTypeId').exists().isNumeric(),
			body('value').exists().isNumeric()
		],
		validateReqSchema,
		(req: Request, res: Response) => transactionPostController.run(req, res)
	);

	const transactionFinder = new TransactionFinder(transactionRepository);
	const queryHandlers = new QueryHandlers([new FindTransactionQueryHandler(transactionFinder)]);
	const queryBus = new InMemoryQueryBus(queryHandlers);
	const transactionGetController = new TransactionGetController(queryBus);
	router.get(
		'/transactions/:id',
		[param('id').exists().isUUID()],
		validateReqSchema,
		(req: FindTransactionRequest, res: Response) => transactionGetController.run(req, res)
	);
};
