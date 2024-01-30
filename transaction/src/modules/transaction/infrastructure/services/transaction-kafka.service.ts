import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { KafkaMessage } from 'kafkajs';

import { AppService } from '../../../../app.service';
import { KafkaService } from '../../../../modules/kafka/kafka.service';
import { TransactionApplication } from '../../application/transaction.application';


@Injectable()
export class TransactionKafkaService {
    constructor(private readonly kafkaService: KafkaService, private readonly application: TransactionApplication) {
        this.kafkaService.subscribeToTopic(AppService.kafka_topic_status, this.receiveResult.bind(this));
    }

    async sentTransaction(transactionId: string, value: number) {
        await this.kafkaService.sendMessage(AppService.kafka_topic, { transactionId, value });
    }

    async receiveResult(message: KafkaMessage) {
        try {
            const dataStr = message.value.toString()
            const dataJson = JSON.parse(dataStr)
            const { transactionId, status } = dataJson

            console.log("DATA RECEIVED")
            console.log("transactionId", transactionId)
            console.log("status", status)

            await this.application.update(transactionId, status)
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }
}