/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IUpdateTransactionStatusRepository } from '@data/protocols/db/transaction/update-transaction-status-repository';
import {
	IQueueSenderService,
	IQueueSubscribeReceiver
} from '@data/protocols/services/queue-service';
import { kafkaQueueConfig } from '@shared/config/queue/kafka-config';
import { TransactionStatusEnum } from '@shared/enum/transaction-status-enum';
import { Consumer, Kafka, Producer } from 'kafkajs';

class TransactionKafkaQueueService
	implements IQueueSenderService<SendMessage, void>, IQueueSubscribeReceiver
{
	private readonly consumer: Consumer;
	private readonly producer: Producer;
	constructor(
		private readonly transactionRepository: IUpdateTransactionStatusRepository,
		private readonly kafka: Kafka
	) {
		this.consumer = this.kafka.consumer({
			groupId: kafkaQueueConfig.transaction.consumerGroupId
		});
		this.producer = this.kafka.producer();
		this.subscribeReceiver(kafkaQueueConfig.transaction.updateTransactionTopic);
	}

	async subscribeReceiver(topic: string): Promise<void> {
		try {
			await this.consumer.subscribe({ topic });
			await this.consumer.connect();
			await this.consumer.run({
				eachMessage: async ({ topic, partition, message }) => {
					const payload: ReceiveMessage = JSON.parse(message.value!.toString());
					await this.transactionRepository.updateStatus(
						payload.status,
						payload.transactionExternalId
					);
				}
			});
		} catch (error) {
			console.log(error);
		}
	}

	async send(message: SendMessage, topic: string): Promise<void> {
		try {
			await this.producer.connect();
			await this.producer.send({
				topic,
				messages: [{ value: JSON.stringify(message) }]
			});
		} catch (error) {
			console.log(error);
		}
	}
}

type SendMessage = {
	accountExternalIdDebit: string;
	accountExternalIdCredit: string;
	transactionExternalId?: string;
	transferTypeId: number;
	status: TransactionStatusEnum;
	value: number;
};

type ReceiveMessage = {
	status: TransactionStatusEnum;
	transactionExternalId: string;
};

export { TransactionKafkaQueueService, SendMessage };
