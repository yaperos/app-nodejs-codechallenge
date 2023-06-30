import { Controller, Injectable, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ValidateTransactionRequestDto } from './dto/validate-transaction-request-dto';
import { ValidateTransactionProducerService } from '../../out/event/validate.transaction.producer.service';
import { AntiFraudService } from '../../../use-case/anti-fraud.service';

@Controller()
export class ValidateTransactionConsumerService {
    constructor(
        private antiFraudService: AntiFraudService,
        private validateTransactionProducerService: ValidateTransactionProducerService
    ) { }

    @EventPattern('validate_transaction')
    validateTransaction(@Payload(ValidationPipe) data: ValidateTransactionRequestDto) {
        console.log('TransactionsConsumerService: data: ' + JSON.stringify(data));

        return this.antiFraudService.validate(data)
            .then(response => this.validateTransactionProducerService.validateTransaction(response));
    }
}