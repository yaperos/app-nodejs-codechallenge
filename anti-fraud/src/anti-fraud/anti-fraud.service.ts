import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AntiFraudRequest } from './anti-fraud.dto';

@Injectable()
export class AntiFraudService {
    constructor(
        @Inject('TRANSACTION_SERVICE') private readonly transactionClient: ClientKafka
    ) {}

    async handlerAntiFraudValidate(data: AntiFraudRequest) {
        this.transactionClient.emit('anti_fraud_validated', JSON.stringify({
            id: data.id, approved: data.value <= 1000
        }));
    }
}
