import { Request, Response, Router } from 'express';
import { body, param } from 'express-validator';

import { CommandHandlers } from '../../../contexts/shared/infrastructure/commandBus/commandHandlers';
import { InMemoryCommandBus } from '../../../contexts/shared/infrastructure/commandBus/inMemoryCommandBus';
import { KafkaConnection } from '../../../contexts/shared/infrastructure/eventBus/kafka/kafkaConnection';
import { TypeOrmClientFactory } from '../../../contexts/shared/infrastructure/persistence/typeorm/typeOrmClientFactory';
import { InMemoryQueryBus } from '../../../contexts/shared/infrastructure/queryBus/inMemoryQueryBus';
import { QueryHandlers } from '../../../contexts/shared/infrastructure/queryBus/queryHandlers';
import { KafkaConfigFactory } from '../../../contexts/transaction/shared/infrastructure/kafka/kafkaConfigFactory';
import { KafkaEventBusFactory } from '../../../contexts/transaction/shared/infrastructure/kafka/kafkaEventBusFactory';
import { TypeOrmConfigFactory } from '../../../contexts/transaction/shared/infrastructure/persistence/postgres/typeOrmConfigFactory';
import { CreateTransactionCommandHandler } from '../../../contexts/transaction/transactions/application/createTransactionCommandHandler';
import { FindTransactionQueryHandler } from '../../../contexts/transaction/transactions/application/findTransactionQueryHandler';
import { TransactionCreator } from '../../../contexts/transaction/transactions/application/transactionCreator';
import { TransactionFinder } from '../../../contexts/transaction/transactions/application/transactionFinder';
import { TypeOrmTransactionRepository } from '../../../contexts/transaction/transactions/infrastructure/persistence/typeOrmTransactionRepository';
import {
	FindTransactionRequest,
	TransactionGetController
} from '../controllers/transactionsGetController';
import { TransactionsPostController } from '../controllers/transactionsPostController';
import { validateReqSchema } from '.';

export const register = async (router: Router) => {
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
