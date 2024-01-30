/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaAdapterService } from './clients/kafka/kafka-adapter.service';
import { ConfigType } from '@nestjs/config';
import config from '../../config';

@Injectable()
export class AdaptersService implements OnModuleInit {
    private topicValidedTransactions: string;
    constructor(@Inject(config.KEY) private configService: ConfigType<typeof config>,
        private kafkaService: KafkaAdapterService
    ) {
        this.topicValidedTransactions = this.configService.KAFKA_VALID_TOPIC_NAME;
    }

    async onModuleInit() {
        const topic = this.topicValidedTransactions;
        this.kafkaService.consumeMessages(topic);
      }


}
