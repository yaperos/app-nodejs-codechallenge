import { KafkaConfigFactory } from '../../contexts/transaction/shared/infrastructure/kafka/kafkaConfigFactory';
import { KafkaEventBusFactory } from '../../contexts/transaction/shared/infrastructure/kafka/kafkaEventBusFactory';
import { DomainEventSubscribers } from '../../contexts/shared/infrastructure/eventBus/domainEventSubscribers';
import { KafkaConnection } from '../../contexts/shared/infrastructure/eventBus/kafka/kafkaConnection';
import { TypeOrmClientFactory } from '../../contexts/shared/infrastructure/persistence/typeorm/typeOrmClientFactory';
import { TypeOrmConfigFactory } from '../../contexts/transaction/shared/infrastructure/persistence/postgres/typeOrmConfigFactory';
import { UpdateTransactionOnTransactionValidated } from '../../contexts/transaction/transactions/application/UpdateTransactionOnTransactionValidated';
import { TransactionStatusUpdater } from '../../contexts/transaction/transactions/application/transactionStatusUpdater';
import { TypeOrmTransactionRepository } from '../../contexts/transaction/transactions/infrastructure/persistence/typeOrmTransactionRepository';
import { Server } from './server';

export class TransactionApp {
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
