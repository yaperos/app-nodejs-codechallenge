import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConsumerService } from "src/kafka/consumer/consumer.service";
import { ValidationService } from "../validation.service";
import { TransactionCreatedDto } from "../dto/TransactionCreatedDto";

@Injectable()
export class TransactionCreatedConsumer implements OnModuleInit {
    private logger = new Logger(TransactionCreatedConsumer.name);

    constructor(
        private readonly consumer: ConsumerService,
        private readonly validationService: ValidationService,
    ) {}

    async onModuleInit() {
        this.consumer.consume(
            "transaction.created.consumer",
            { topics: ["transaction.created"] },
            {
                eachMessage: async ({ topic, partition, message }) => {
                    const request = JSON.parse(message.value.toString()) as TransactionCreatedDto;
                    this.logger.log("Transaction created with ID: " + request.transactionExternalId);

                    this.validationService.validateTransaction(request.transactionExternalId, request.value);
                },
            },
        );
    }
}
