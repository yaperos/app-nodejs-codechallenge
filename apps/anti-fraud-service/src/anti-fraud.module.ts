import { DatabaseModule, KafkaModule } from '@app/common';
import { LoggingModule, ObservabilityModule, TracingModule } from '@app/observability';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ValidateTransactionUseCase } from './application/use-cases/validate-transaction.use-case';
import { VALIDATE_TRANSACTION_USE_CASE } from './domain/ports/input/validate-transaction.use-case.interface';
import { EVENT_PUBLISHER } from './domain/ports/output/event-publisher.interface';
import { FRAUD_RULE_REPOSITORY } from './domain/repositories/fraud-rule.repository.interface';
import { RulesEngineService } from './domain/services/rules-engine.service';
import { KafkaEventPublisher } from './infrastructure/messaging/kafka-event-publisher';
import { TransactionCreatedConsumer } from './infrastructure/messaging/transaction-created.consumer';
import { FraudRuleRepository } from './infrastructure/repositories/fraud-rule.repository';

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
                const url = configService.get<string>('ANTIFRAUD_DB_URL');
                if (!url) {
                    throw new Error('ANTIFRAUD_DB_URL environment variable is required');
                }
                return { url };
            },
        }),
        ObservabilityModule.forRoot({
            serviceName: 'anti-fraud-service',
            enableSentry: process.env.SENTRY_ENABLED === 'true',
            sentryDsn: process.env.SENTRY_DSN,
            environment: process.env.NODE_ENV || 'development',
        }),
        TracingModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                serviceName: 'anti-fraud-service',
                serviceVersion: '1.0.0',
                otlpEndpoint: config.get('OTEL_EXPORTER_OTLP_ENDPOINT', 'http://localhost:4318'),
                environment: config.get('NODE_ENV', 'development'),
                sampling: parseFloat(config.get('OTEL_SAMPLING_RATIO', '1.0')),
                enabled: config.get('OTEL_ENABLED', 'true') !== 'false',
            }),
        }),

        LoggingModule.forRoot('anti-fraud-service'),
        KafkaModule.forRootAsync({
            isGlobal: true,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const kafkaBroker = configService.get<string>('KAFKA_BROKER');
                if (!kafkaBroker) {
                    throw new Error('KAFKA_BROKER environment variable is required');
                }
                return {
                    clientId: 'anti-fraud-service',
                    brokers: [kafkaBroker],
                    consumerConfig: {
                        groupId: 'anti-fraud-service-group-v2',
                    },
                };
            },
        }),
    ],
    controllers: [],
    providers: [
        {
            provide: VALIDATE_TRANSACTION_USE_CASE,
            useClass: ValidateTransactionUseCase,
        },

        RulesEngineService,
        {
            provide: FRAUD_RULE_REPOSITORY,
            useClass: FraudRuleRepository,
        },

        TransactionCreatedConsumer,
        {
            provide: EVENT_PUBLISHER,
            useClass: KafkaEventPublisher,
        },
    ],
})
export class AntiFraudModule {}
