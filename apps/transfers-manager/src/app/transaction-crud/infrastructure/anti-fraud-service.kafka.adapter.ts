import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { MICROSERVICES_CONSTANTS } from "@yape-transactions/shared";
import { AntiFraudServiceCommand } from "../domain/anti-fraud-service.command";
import { AntiFraudServicePort } from "../domain/anti-fraud-service.port";

@Injectable()
export class AntiFraudServiceKafkaAdapater implements AntiFraudServicePort {
    private logger = new Logger(AntiFraudServiceKafkaAdapater.name);

    constructor(
        @Inject(MICROSERVICES_CONSTANTS.ANTI_FRAUD_MICROSERVICE.name) private readonly antiFraudClient: ClientKafka
    ) { }

    triggerAntiFraudService(command: AntiFraudServiceCommand) {
        this.logger.debug(`lanzando evento ${MICROSERVICES_CONSTANTS.EVENTS.TRANSACTION_CREATED}, data: ${JSON.stringify(command)}`)
        this.antiFraudClient.emit(
            MICROSERVICES_CONSTANTS.EVENTS.TRANSACTION_CREATED,
            JSON.stringify(command.transactionData));
    }



}