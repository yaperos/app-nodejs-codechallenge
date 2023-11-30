import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApolloServerModule } from '@app/apollo-server';
import { KAFKA_SERVICES } from '@app/constants';
import { AntiFraudController } from './anti-fraud.controller';
import { AntifraudService } from './anti-fraud.service';
import { AntifraudResolver } from './anti-fraud.resolver';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ApolloServerModule.forRoot(),
    ClientsModule.registerAsync({
      clients: [
        {
          name: KAFKA_SERVICES.TRANSACTION,
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: () => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                brokers: ['localhost:9092'],
              },
              consumer: {
                groupId: 'transaction-consumer',
              },
            },
          }),
        },
      ],
    }),
  ],
  controllers: [AntiFraudController],
  providers: [AntifraudService, AntifraudResolver],
})
export class AntiFraudModule {}
