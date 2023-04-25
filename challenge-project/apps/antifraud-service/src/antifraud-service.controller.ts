import { TransactionCreatedEvent } from "@app/common/events";
import { Controller, Logger } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AntifraudServiceService } from "./antifraud-service.service";

@Controller()
export class AntifraudServiceController {
    constructor(private readonly service: AntifraudServiceService) { }

    @MessagePattern('transaction-created')
    public transactionCreated(@Payload() payload: TransactionCreatedEvent) {
        Logger.log(payload, AntifraudServiceController.name)
        this.service.validateTransaction(payload);
    }
}