/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import config from '../../../../../config';
import { KafkaClientService } from '@app/kafka-client'
import { ApiAntifraudService } from '../../core/application/api-antifraud/api-antifraud.service';

@Injectable()
export class AdaptersService implements OnModuleInit {
    private readonly logger = new Logger(AdaptersService.name)
    private topicPendingTransactions: string;
    constructor(@Inject(config.KEY) private configService: ConfigType<typeof config>,
        private kafkaService: KafkaClientService,
        private antifraudService: ApiAntifraudService,
    ) {
        this.topicPendingTransactions = this.configService.KAFKA_TRANSACTIONS_TOPIC;
    }

    async onModuleInit() {
        const topic = this.topicPendingTransactions;
        const random_num = Math.floor(Math.random() * 100);
        const group_id = `${this.configService.KAFKA_CONSUMER_GROUPID}${random_num}`;
        console.log({group_id})

        this.kafkaService.consumeMessagesWithConfig(
            { topics: [topic] },
            {
                eachMessage: async ({ topic, partition, message }) => {
                    this.logger.log({
                        value: message.value.toString(),
                        topic: topic.toString(),
                        partition: partition.toString(),
                    })
                    await this.handleMessage(message);
                }
            },
            group_id)
    }

    async handleMessage(message: any) {
        const buffer = message.value as Buffer;
        const messageString = buffer.toString();
        const messageObject = JSON.parse(messageString);
        await this.antifraudService.processTransaction(messageObject);

    }


}
