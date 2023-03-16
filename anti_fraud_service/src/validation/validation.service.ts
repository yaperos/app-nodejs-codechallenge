import { Injectable, Logger } from "@nestjs/common";
import { ProducerService } from "src/kafka/producer/producer.service";
import { ValidationResultDto } from "./dto/ValidationResultDto";
import { ValidationParams } from "./helper/ValidationParams";

@Injectable()
export class ValidationService {
    private logger = new Logger(ValidationService.name);

    constructor(
        // Kafka producer
        private readonly kafka: ProducerService,
    ) {}

    async validateTransaction(transactionExternalId: string, value: number) {
        this.logger.log("Validating transaction: " + transactionExternalId);
        const result: ValidationResultDto = {
            transactionExternalId,
            valid: value <= ValidationParams.MAX_TRANSACTION_VALUE ? true : false,
        };

        if (result.valid) {
            this.kafka.produce({
                topic: "transaction.approved",
                messages: [{ value: JSON.stringify(result) }],
            });
        } else {
            this.kafka.produce({
                topic: "transaction.rejected",
                messages: [{ value: JSON.stringify(result) }],
            });
        }
    }
}
