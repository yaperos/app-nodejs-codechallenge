import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { AppConfiguration } from 'src/config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    ClientsModule.registerAsync([
      {
        imports: [
          ConfigModule.forRoot({
            load: [AppConfiguration],
          }),
        ],
        name: 'ANTI_FRAUD_PACKAGE',
        useFactory: async () => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'api-ms-anti-fraud-client',
              brokers: [AppConfiguration().kafka_broker],
            },
            producer: {
              createPartitioner: Partitioners.DefaultPartitioner,
              allowAutoTopicCreation: true,
            },
            consumer: {
              groupId: 'api-ms-anti-fraud-consumer',
            },
          },
        }),
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TypeOrmModule],
})
export class TransactionModule {}
