import { KafkaConfigFactory } from '../../contexts/antifraud/shared/infrastructure/kafka/kafkaConfigFactory';
import { KafkaEventBusFactory } from '../../contexts/antifraud/shared/infrastructure/kafka/kafkaEventBusFactory';
import { TransactionValidator } from '../../contexts/antifraud/transactions/application/transactionValidator';
import { CreateTransactionOnTransactionCreated } from '../../contexts/antifraud/transactions/application/validateTransactionOnTransactionCreated';
import { DomainEventSubscribers } from '../../contexts/shared/infrastructure/eventBus/domainEventSubscribers';
import { KafkaConnection } from '../../contexts/shared/infrastructure/eventBus/kafka/kafkaConnection';
import { Server } from './server';

export class AntiFraudApp {
	server?: Server;

	async start(): Promise<void> {
		const port = process.env.PORT ?? '4000';
		this.server = new Server(port);

		await this.configureEventBus();

		return this.server.listen();
	}


	async stop(): Promise<void> {
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
