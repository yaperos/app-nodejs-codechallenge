import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConsumerService } from "src/kafka/consumer/consumer.service";
import { ValidationService } from "../validation.service";
import { ValidationRequestDto } from "../dto/ValidationRequestDto";

@Injectable()
export class ValidationRequestConsumer implements OnModuleInit {
    private logger = new Logger(ValidationRequestConsumer.name);

    constructor(
        private readonly consumer: ConsumerService,
        private readonly validationService: ValidationService,
    ) {}

    async onModuleInit() {
        this.consumer.consume(
            { topics: ["transaction.validation_request"] },
            {
                eachMessage: async ({ topic, partition, message }) => {
                    const request = JSON.parse(message.value.toString()) as ValidationRequestDto;
                    this.logger.log("Validation request for transaction: " + request.transactionExternalId);

                    this.validationService.validateTransaction(request.transactionExternalId, request.value);
                },
            },
        );
    }
}
