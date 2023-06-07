import { Controller, Inject } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ValidateTransactionPort } from "../../../ports/in/validate-transaction.port";
import { ValidateTransactionUseCase } from "src/antifraud/application/validate-transaction.usecase";

@Controller()
export class KafkaMessageBrokerEvent {
    constructor(
        @Inject(ValidateTransactionUseCase) private readonly messageBrokerPort: ValidateTransactionPort
    ) { }

    @MessagePattern('topic-transaction-created')
    async consumeEvent(@Payload() payload: any) {
        const obj = JSON.parse(JSON.stringify(payload));
        this.messageBrokerPort.validateTransaction(obj);
    }
}