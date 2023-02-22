/* eslint-disable @typescript-eslint/no-floating-promises */
import { DomainEventSubscribers } from '../../Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers';
import { KafkaConnection } from '../../Contexts/Shared/infrastructure/EventBus/Kafka/KafkaConnection';
import { TypeOrmClientFactory } from '../../Contexts/Shared/infrastructure/persistence/typeorm/TypeOrmClientFactory';
import { KafkaConfigFactory } from '../../Contexts/Transaction/Shared/infrastructure/Kafka/KafkaConfigFactory';
import { KafkaEventBusFactory } from '../../Contexts/Transaction/Shared/infrastructure/Kafka/KafkaEventBusFactory';
import { TypeOrmConfigFactory } from '../../Contexts/Transaction/Shared/infrastructure/persistence/postgres/TypeOrmConfigFactory';
import { TransactionStatusUpdater } from '../../Contexts/Transaction/Transactions/application/TransactionStatusUpdater';
import { UpdateTransactionOnTransactionValidated } from '../../Contexts/Transaction/Transactions/application/UpdateTransactionOnTransactionValidated';
import { TypeOrmTransactionRepository } from '../../Contexts/Transaction/Transactions/infrastructure/persistence/TypeOrmTransactionRepository';
import { Server } from './server';

export class TransationApp {
	server?: Server;

	async start(): Promise<void> {
		const port = process.env.PORT ?? '6000';
		this.server = new Server(port);

		await this.configureEventBus();

		return this.server.listen();
	}

	get httpServer(): Server['httpServer'] | undefined {
		return this.server?.getHTTPServer();
	}

	async stop(): Promise<void> {
		const config = KafkaConfigFactory.createConfig();
		const connection = new KafkaConnection(config);
		await connection.close();

		return this.server?.stop();
	}

	private async configureEventBus() {
		const kafkaConfig = KafkaConfigFactory.createConfig();
		const kafkaConnection = new KafkaConnection(kafkaConfig);
		const eventBus = KafkaEventBusFactory.create(kafkaConnection, kafkaConfig);
		await kafkaConnection.connect();

		const config = TypeOrmConfigFactory.createConfig();
		const connection = TypeOrmClientFactory.createClient('transaction', config);
		const transactionRepository = new TypeOrmTransactionRepository(connection);

		const domainEventSubscribers = new DomainEventSubscribers([
			new UpdateTransactionOnTransactionValidated(
				new TransactionStatusUpdater(transactionRepository)
			)
		]);

		eventBus.addSubscribers(domainEventSubscribers);
	}
}
