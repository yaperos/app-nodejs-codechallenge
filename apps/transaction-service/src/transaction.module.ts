import { DatabaseModule, KafkaModule, RedisModule } from '@app/common';
import { LoggingModule, ObservabilityModule, TracingModule } from '@app/observability';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { GetTransactionUseCase } from './application/use-cases/get-transaction.use-case';
import { UpdateTransactionStatusUseCase } from './application/use-cases/update-transaction-status.use-case';
import { CREATE_TRANSACTION_USE_CASE } from './domain/ports/input/create-transaction.use-case.interface';
import { GET_TRANSACTION_USE_CASE } from './domain/ports/input/get-transaction.use-case.interface';
import { UPDATE_TRANSACTION_STATUS_USE_CASE } from './domain/ports/input/update-transaction-status.use-case.interface';
import { EVENT_PUBLISHER } from './domain/ports/output/event-publisher.interface';
import { TRANSACTION_REPOSITORY } from './domain/repositories/transaction.repository.interface';
import { TransactionEventService } from './infrastructure/messaging/transaction-event.service';
import { TransactionStatusConsumer } from './infrastructure/messaging/transaction-status.consumer';
import { TransactionRepository } from './infrastructure/repositories/transaction.repository';
import { TransactionController } from './presentation/controllers/transaction.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        DatabaseModule.forRootAsync({
            isGlobal: true,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const url = configService.get<string>('TRANSACTION_DB_URL');
                if (!url) {
                    throw new Error('TRANSACTION_DB_URL environment variable is required');
                }
                return { url };
            },
        }),
        RedisModule,
        ObservabilityModule.forRoot({
            serviceName: 'transaction-service',
            enableSentry: process.env.SENTRY_ENABLED === 'true',
            sentryDsn: process.env.SENTRY_DSN,
            environment: process.env.NODE_ENV || 'development',
        }),
        TracingModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                serviceName: 'transaction-service',
                serviceVersion: '1.0.0',
                otlpEndpoint: config.get('OTEL_EXPORTER_OTLP_ENDPOINT', 'http://localhost:4318'),
                environment: config.get('NODE_ENV', 'development'),
                sampling: Number.parseFloat(config.get('OTEL_SAMPLING_RATIO', '1.0')),
                enabled: config.get('OTEL_ENABLED', 'true') !== 'false',
            }),
        }),

        LoggingModule.forRoot('transaction-service'),
        KafkaModule.forRootAsync({
            isGlobal: true,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const kafkaBroker = configService.get<string>('KAFKA_BROKER');
                if (!kafkaBroker) {
                    throw new Error('KAFKA_BROKER environment variable is required');
                }
                return {
                    clientId: 'transaction-service',
                    brokers: [kafkaBroker],
                    consumerConfig: {
                        groupId: 'transaction-service-group',
                    },
                };
            },
        }),
    ],
    controllers: [TransactionController],
    providers: [
        {
            provide: CREATE_TRANSACTION_USE_CASE,
            useClass: CreateTransactionUseCase,
        },
        {
            provide: GET_TRANSACTION_USE_CASE,
            useClass: GetTransactionUseCase,
        },
        {
            provide: UPDATE_TRANSACTION_STATUS_USE_CASE,
            useClass: UpdateTransactionStatusUseCase,
        },
        {
            provide: TRANSACTION_REPOSITORY,
            useClass: TransactionRepository,
        },
        {
            provide: EVENT_PUBLISHER,
            useClass: TransactionEventService,
        },
        TransactionStatusConsumer,
    ],
})
export class TransactionModule {}
