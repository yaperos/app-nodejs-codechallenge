/* eslint-disable @typescript-eslint/no-floating-promises */
import { KafkaConfigFactory } from '../../Contexts/AntiFraud/Shared/infrastructure/Kafka/KafkaConfigFactory';
import { KafkaEventBusFactory } from '../../Contexts/AntiFraud/Shared/infrastructure/Kafka/KafkaEventBusFactory';
import { TransactionValidator } from '../../Contexts/AntiFraud/Transactions/application/TransactionValidator';
import { CreateTransactionOnTransactionCreated } from '../../Contexts/AntiFraud/Transactions/application/ValidateTransactionOnTransactionCreated';
import { DomainEventSubscribers } from '../../Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers';
import { KafkaConnection } from '../../Contexts/Shared/infrastructure/EventBus/Kafka/KafkaConnection';
import { Server } from './server';

export class AntiFraudApp {
	server?: Server;

	async start(): Promise<void> {
		const port = process.env.PORT ?? '4000';
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
		const config = KafkaConfigFactory.createConfig();
		const connection = new KafkaConnection(config);
		const eventBus = KafkaEventBusFactory.create(connection, config);
		await connection.connect();

		const domainEventSubscribers = new DomainEventSubscribers([
			new CreateTransactionOnTransactionCreated(new TransactionValidator(eventBus))
		]);

		eventBus.addSubscribers(domainEventSubscribers);
	}
}
