import { Logger } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import {MessageTransactionModel} from "../../../Domain/Models/MessageTransactionModel";
import {EventConsumerInterface} from "../../../Domain/Interfaces/EventConsumerInterface";

export class KafkaEventConsumer implements EventConsumerInterface {
    private consumerKafka: Consumer;
    private readonly logger = new Logger(KafkaEventConsumer.name);

    constructor(
        private readonly kafka: Kafka,
        private readonly topic: string,
        private readonly groupId: string
    ) {
        this.consumerKafka = this.kafka.consumer({ groupId });
    }

    async consumer(callback: (message: MessageTransactionModel) => Promise<void>): Promise<void> {
        await this.consumerKafka.connect();
        await this.consumerKafka.subscribe({ topic: this.topic, fromBeginning: true});

        await this.consumerKafka.run({
            eachMessage: async ({ message }): Promise<void> => {
                this.logger.log(`consumer: ${JSON.stringify(message)}`);
                try {
                    const messageData = message.value ? JSON.parse(message.value.toString()) : {};
                    const messageBroker = new MessageTransactionModel(
                        messageData.transactionExternalId,
                        messageData.value
                    );
                    await callback(messageBroker);
                } catch (error) {
                    console.log(error);
                    this.logger.log(`consumer | error: ${JSON.stringify(error)}`);
                    throw error;
                }
            },
        });
    }
}
