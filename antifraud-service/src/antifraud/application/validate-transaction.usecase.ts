import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ValidateTransactionPort } from "../infraestructure/ports/in/validate-transaction.port";
import { Transaction } from "../domain/transaction.domain";
import { BusinessException } from "./exceptions/business.exception";
import { ExceptionEnum } from "./enums/exception.enum";
import { generateRandomNumber } from "./utils/number.util";
import { KafkaEventMessageAdapter } from "../infraestructure/adapters/out/kafka-event-message.adapter";
import { EventMessagePort } from "../infraestructure/ports/out/event-message.port";
import { ConfigService } from "src/config/config.service";

const status = ['approved', 'rejected'];

@Injectable()
export class ValidateTransactionUseCase implements ValidateTransactionPort {
    properties: any;
    constructor(
        @Inject(KafkaEventMessageAdapter) private readonly eventMessagePort: EventMessagePort,
        private readonly configService: ConfigService) {
        this.properties = require("./utils/message.util");
    }
    
    validateTransaction(transaction: Transaction) {
        try{
            setTimeout(() => {
                const index = generateRandomNumber();
                transaction.status = status[index];
                this.eventMessagePort.sendMessage(this.configService.get('KAFKA_TOPIC_ANTIFRAUD_VALIDATED'), JSON.stringify(transaction));
            }, 6000);            
        } catch(ex) {
            throw new BusinessException(
                ExceptionEnum.ERROR_SEND_MESSAGE,
                this.properties.get("exception.send_message.error"),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}