import { Module } from '@nestjs/common';
import { TransactionCrudController } from './infrastructure/transaction-crud.controller';
import { TransactionCrudService } from './application/transaction-crud.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES_CONSTANTS, TransactionEntity } from '@yape-transactions/shared';
import { ANTI_FRAUD_SERVICE_PORT_TOKEN } from './domain/anti-fraud-service.port';
import { AntiFraudServiceKafkaAdapater } from './infrastructure/anti-fraud-service.kafka.adapter';
import { CREATE_TRANSACTION_PORT_TOKEN } from './domain/create-transaction.port';
import { CreateTransactionDBAdapater } from './infrastructure/create-transaction.db.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';

// default: localhost:9092
const brokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];


@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionEntity]),
        ClientsModule.register([
            {
                name: MICROSERVICES_CONSTANTS.ANTI_FRAUD_MICROSERVICE.name,
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'anti-fraud',
                        brokers,
                    },
                    producerOnlyMode: true,
                    consumer: {
                        groupId: MICROSERVICES_CONSTANTS.ANTI_FRAUD_MICROSERVICE.groupId,
                    },
                },
            },
        ])
    ],
    controllers: [TransactionCrudController],
    providers: [TransactionCrudService, {
        provide: ANTI_FRAUD_SERVICE_PORT_TOKEN,
        useClass: AntiFraudServiceKafkaAdapater
    }, {
            provide: CREATE_TRANSACTION_PORT_TOKEN,
            useClass: CreateTransactionDBAdapater
        }],
})
export class TransactionCrudModule { }
