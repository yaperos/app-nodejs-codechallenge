import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ValidateTransactionResponseDto } from './dto/validate-transaction-response-dto';

@Injectable()
export class ValidateTransactionProducerService {
    constructor(@Inject('TRANSACTION_MICROSERVICE') private readonly antiFraudClient: ClientKafka) {}

    async validateTransaction(validateTransactionResponseDto: ValidateTransactionResponseDto) {

        const topic = 'transaction_' + validateTransactionResponseDto.transactionStatus.toLowerCase();
        const dto = JSON.stringify(validateTransactionResponseDto);

        return this.antiFraudClient.emit(topic, dto)
            .forEach(() => console.log('ValidateTransactionProducerService: data: ' + dto + ', topic: ' + topic));
    }
}