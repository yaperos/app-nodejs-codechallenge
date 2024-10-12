const { Kafka, Partitioners } = require('kafkajs');
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { AppLoggerAdapter } from "../../classes/AppLoggerAdapter.class";
import { GuidAdapter } from "../../classes/GuidAdapter.class";
import { Transaction } from "../../classes/Transaction.class";
import { EKafkaTopics } from "../../enum/KafkaTopics.enum";

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
	private kafka;
	private consumer;	

	constructor() {
		this.kafka = new Kafka({
			clientId: process.env.KAFKA_CLIENT_ID,
			brokers: [process.env.KAFKA_BROKER],
		});

		this.consumer = this.kafka.consumer({ 
			groupId: process.env.KAFKA_GROUP_ID
		});
	}

	onModuleInit() {
		this.connectAndSubscribe();
	}

	onModuleDestroy() {
		this.kafka.disconnect();
	}

	public async emit(logger: AppLoggerAdapter, topic, payload) {
		const producer = this.kafka.producer({
			createPartitioner: Partitioners.LegacyPartitioner
		});

		logger.logInfo('Connecting to Kafka as Producer');
		await producer.connect();
		
		logger.logInfo(`Trying to publish into kafka ${topic} topic`);
		await producer.send({ topic, messages: [
			{ key: GuidAdapter.create(), value: JSON.stringify(payload) }
		] });
		logger.logInfo('Published into kafka topic successfully');
		
		logger.logInfo('Disconnecting from Kafka as Producer');
		await producer.disconnect();
	}

	private async connectAndSubscribe() {
		const logger: AppLoggerAdapter = new AppLoggerAdapter(
			GuidAdapter.create(),
			'ms-fraud-detector-subscribing'
		);
		const topics: string[] = process.env.KAFKA_SUBSCRIBE_TOPICS?.split(',');

		logger.logInfo(`topics to subscribe: ${topics.length}`);
		if(topics.length) {
			logger.logInfo('Connecting to Kafka as Consumer');
			await this.consumer.connect();
	
			Promise.all(
				topics.map(async (topic: string) => {
						logger.logInfo(`Subscribing to topic: ${topic}`);
						await this.consumer.subscribe({ topic, fromBeginning: true });
				})
			);

			logger.logInfo('Listening for new messages from topic trx-created');
			await this.consumer.run({
				eachMessage: async ({ message }) => {
					this.messageProcessing(message);
				},
			});
	
		}

	}

	async messageProcessing (message): Promise<void> {
		const logger: AppLoggerAdapter = new AppLoggerAdapter(
			GuidAdapter.create(),
			'ms-fraud-detector-subscribing'
		);
		
		const msgObject = JSON.parse(message.value.toString());
		const trx = new Transaction( msgObject.transactionId, msgObject.value );

		const approvedTransaction:boolean = trx.validateTransaction();

		if (approvedTransaction) {
			this.emit(logger, EKafkaTopics.TRX_APPROVED, trx);
		} else {
			this.emit(logger, EKafkaTopics.TRX_REJECTED, trx);
		}
	}
	
}