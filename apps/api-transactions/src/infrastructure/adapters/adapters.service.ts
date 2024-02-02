/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
//import { KafkaAdapterService } from './clients/kafka/kafka-adapter.service';
import { ConfigType } from '@nestjs/config';
import config from '../../../../../config';
import { KafkaClientService } from '@app/kafka-client'
import { ApiTransactionService } from '../../core/application/api-transaction/api-transaction.service';

@Injectable()
export class AdaptersService implements OnModuleInit {
    private readonly logger = new Logger(AdaptersService.name)
    private topicValidedTransactions: string;
    constructor(@Inject(config.KEY) private configService: ConfigType<typeof config>,
        private kafkaService: KafkaClientService,
        private apiTransactionService: ApiTransactionService
    ) {
        this.topicValidedTransactions = this.configService.KAFKA_VALID_TOPIC_NAME;
    }

    async onModuleInit() {
        const topic = this.topicValidedTransactions;
        const random_num = Math.floor(Math.random() * 100);
        const group_id = `${this.configService.KAFKA_CONSUMER_GROUPID}${random_num}`;
        console.log({group_id})

        this.kafkaService.consumeMessagesWithConfig(
            { topics: [topic]},
            {
                eachMessage: async ({ topic, partition, message }) => {
                    this.logger.log({
                        value: message.value.toString(),
                        topic: topic.toString(),
                        partition: partition.toString(),
                    })
                    await this.handleMessage(message);
                }
            }, group_id)
    }

    async handleMessage(message: any) {
        const buffer = message.value as Buffer;
        const messageString = buffer.toString();
        const messageObject = JSON.parse(messageString);
        await this.apiTransactionService.updateTransaction(messageObject);

    }


}
