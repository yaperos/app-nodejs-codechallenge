import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from './kafka/consumer.service';
import { TransactionStatus } from './transaction/entities/transaction-status.entity';
import { Transaction } from './transaction/entities/transaction.entity';

@Injectable()
export class AntiFraudConsumer implements OnModuleInit {
	constructor(private readonly consumerService: ConsumerService) {}

	public async onModuleInit(): Promise<void> {
		await this.consumerService.consume(
			{ topics: ['anti-fraud'] },
			{
				eachMessage: async ({ topic, partition, message }) => {
					const messageJson = JSON.parse(message.value.toString());
					console.log({
						value: messageJson,
						topic: topic.toString(),
						partition: partition.toString(),
					});
					const { database_id, status } = messageJson;
					const transactionStatus = await TransactionStatus.findOne({ where: { name: status } });

					if (transactionStatus) {
						await Transaction.update(database_id, { transactionStatusId: transactionStatus.id });
					} else {
						throw new BadRequestException('transaction not found');
					}
				},
			},
		);
	}
}
