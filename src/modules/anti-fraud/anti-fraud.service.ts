import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { TransactionDto } from '../transactions/dtos/transaction.dto';
import { AppConfigService } from '../@config/app-config.service';
import { KafkaProducerService } from '../kafka/kafka-producer.service';
import { KafkaConsumerService } from '../kafka/kafka-consumer.service';
import { ANTI_FRAUD_CONSUMER, EVENTS } from 'src/app.constants';
import { TransactionStatuses } from '../transactions/types/transaction-types-enums';

@Injectable()
export class AntifraudService implements OnModuleInit {

    constructor(
        private readonly appConfigService: AppConfigService,
        private readonly producer: KafkaProducerService,
        private readonly consumer: KafkaConsumerService) { }


    async onModuleInit() {
        await this.producer.connect();
        await this.consumer.connect(ANTI_FRAUD_CONSUMER);

        this.consumer.subscribe(EVENTS.ON_TRANSACTION_CREATED, _transaction => {
            console.log('Step 2');
            const transaction = JSON.parse(_transaction);
            this.verifyTransaction(transaction)
        });
    }

    async verifyTransaction(transaction: TransactionDto) {
        return new Promise((resolve: Function, reject: Function) => {
            console.log('Step 3');
            
            const status = transaction.value > 1000 ? TransactionStatuses.REJECTED: TransactionStatuses.COMPLETED;

            setTimeout(() => {
                this.producer.send(EVENTS.ON_TRANSACTION_VALIDATED, JSON.stringify({ _id: transaction._id, transactionStatus: status }))
                resolve();
            }, 3000);
        })
    }

}


