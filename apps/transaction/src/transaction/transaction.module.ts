import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './repository/transaction.repository';
import { TransactionCreatedPublisher } from './publisher/transaction-created.publisher';
import { TransactionMapper } from './mapper/transaction.mapper';
import { TransactionResponseMapper } from './mapper/transaction-response.mapper';
import { TransactionEventMapper } from './mapper/transaction-event.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApplicationProperties } from './config/application.properties';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'ANTI_FRAUD_MICROSERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get('application.kafka.clientId'),
              brokers: configService.get<Array<string>>('application.kafka.bootstrap-servers'),
            },
            consumer: {
              groupId: configService.get('application.kafka.groupId'),
            },
          }
        }),
        inject: [ConfigService],
      },
    ]),
    TypeOrmModule.forFeature([Transaction])
  ],
  providers: [TransactionService, TransactionRepository, TransactionCreatedPublisher,
    TransactionMapper, TransactionResponseMapper, TransactionEventMapper, ApplicationProperties],
  controllers: [TransactionController],
})
export class TransactionModule {} 