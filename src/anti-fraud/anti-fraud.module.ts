import { Module } from '@nestjs/common';
import { ValidateTransactionConsumerService } from './adapter/in/event/validate.transaction.consumer.service';
import { ValidateTransactionProducerService } from './adapter/out/event/validate.transaction.producer.service';
import { AntiFraudService } from './use-case/anti-fraud.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'TRANSACTION_MICROSERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'transaction',
                        brokers: ['localhost:9092'],
                    },
                    consumer: {
                        groupId: 'transaction-consumer',
                    },
                },
            },
        ])
    ],
    controllers: [ValidateTransactionConsumerService],
    providers: [AntiFraudService, ValidateTransactionConsumerService, ValidateTransactionProducerService]
})
export class AntiFraudModule {}
