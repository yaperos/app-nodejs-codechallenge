import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConsumerService } from "./consumer.service";
import { TransactionsService } from "../transactions.service";

@Injectable()
export class KafkaConsumer implements OnModuleInit {
    constructor(
        private readonly consumerService: ConsumerService,
        private readonly transactionService: TransactionsService
        ) {}

    async onModuleInit() {
        await this.consumerService.consume(
            {topics: ['transaction-verification']},
            {
                eachMessage: async ({topic, partition, message}) => {
                    const { id, status } = JSON.parse(message.value.toString());
                    this.transactionService.update(status, id);
                }
            }
        )
    }
}