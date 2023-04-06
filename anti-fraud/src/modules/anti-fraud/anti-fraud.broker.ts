import { Controller, OnModuleInit } from "@nestjs/common";
import { ClientKafka, EventPattern, MessagePattern } from "@nestjs/microservices";
import { TransactionDto } from "./dtos/external-dto";
import { Events } from "./types/events";
import { AntiFraudService } from "./anti-fraud.service";

@Controller()
export class AntiFraudBroker {
    constructor(private readonly antiFraudService: AntiFraudService) {}

    @MessagePattern(Events.ON_TRANSACTION_CREATE)
    onTransactionCreate(transaction: TransactionDto): void {
        console.log('2:: NEW TRANSACTION ARRIVED, VALIDATING AND SENDING RESPONSE')
        this.antiFraudService.validateTransaction(transaction);
    }
}