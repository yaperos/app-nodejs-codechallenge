import {
    Injectable,
    Logger,
} from "@nestjs/common";
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
            valid:
                value <= ValidationParams.MAX_TRANSACTION_VALUE ? true : false,
        };

        this.kafka.produce({
            topic: "transaction.validation_result",
            messages: [{ value: JSON.stringify(result) }],
        });
    }
}
