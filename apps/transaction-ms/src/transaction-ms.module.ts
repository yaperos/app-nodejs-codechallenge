import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaClientModule } from './contexts/shared/infrastructure/prisma-client';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApolloServerModule } from './apps/apollo-server';
import { CqrsModule } from '@nestjs/cqrs';
import { TransactionResolver } from './contexts/transaction-finance/application/transaction.resolver';
import { TransactionRepositoryImp } from './contexts/transaction-finance/infrastructure/persistence/postgresql/TransactionRepositoryImp';
import { TRANSACTION_REPOSITORY } from './contexts/transaction-finance/token_repository.di';
import { DepositCommandHandler } from './contexts/transaction-finance/application/deposit/DepositCommandHandler';
import { FindDepositQueryHandler } from './contexts/transaction-finance/application/find/FindDepositQueryHandler';
import { HealthModule } from './contexts/health/health.module';
import { EventsModule } from './apps/events/events.module';
import { ANTI_FRAUD_CLIENT } from './contexts/shared/domain/constants';
import {
  ANTI_FRAUD_CONSUMER_SERVER,
  ANTI_FRAUD_SERVER,
} from 'utils/utils/constants-global';

const repositories: Provider[] = [
  {
    provide: TRANSACTION_REPOSITORY,
    useClass: TransactionRepositoryImp,
  },
];

const commandHandlers: Provider[] = [DepositCommandHandler];

const queryHandlers: Provider[] = [FindDepositQueryHandler];

@Module({
  imports: [
    PrismaClientModule,
    CqrsModule,
    ConfigModule.forRoot(),
    ApolloServerModule.forRoot(),
    ClientsModule.registerAsync({
      clients: [
        {
          name: ANTI_FRAUD_CLIENT,
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                brokers: [configService.get<string>('KAFKA_BROKER_URL')],
                clientId: ANTI_FRAUD_SERVER,
              },
              consumer: {
                groupId: ANTI_FRAUD_CONSUMER_SERVER,
              },
            },
          }),
        },
      ],
    }),
    HealthModule,
    EventsModule,
  ],
  controllers: [],
  providers: [
    TransactionResolver,
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
  ],
})
export class TransactionMsModule {}
