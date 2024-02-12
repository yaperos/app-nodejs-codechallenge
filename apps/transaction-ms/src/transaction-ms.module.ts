import { Module } from '@nestjs/common';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionService } from './services/transaction.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionStatus } from './entities/transaction-status.entity';
import { TransactionType } from './entities/transaction-type.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionStatusService } from './services/transaction-status.service';
import { TransactionTypeService } from './services/transaction-type.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import typeorm from './config/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    TypeOrmModule.forFeature([Transaction, TransactionType, TransactionStatus]),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud-ms',
            brokers: ['localhost:9092'],
          },
          producer: {
            allowAutoTopicCreation: true,
          },
          consumer: {
            groupId: 'anti-fraud-consumer-group',
          },
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TransactionStatusService,
    TransactionTypeService,
  ],
})
export class TransactionMsModule {}
