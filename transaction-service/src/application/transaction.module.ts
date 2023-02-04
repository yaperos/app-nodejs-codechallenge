import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/domain/transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from '../domain/transaction.service';
import { LoggerModule } from '../infraestructure/logger/logger.module';
import { TransactionConfig } from 'src/domain/transaction.config';
import { TransferType } from 'src/domain/transaction-type.entity';
import { RedisModule } from '../infraestructure/cache/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransferType]),
    ClientsModule.register([
      {
        name: 'YAPE_EVENT_BUS',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            brokers: ['localhost:9092'],
          },
          producerOnlyMode: true,
        },
      },
    ]),
    LoggerModule,
    RedisModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionConfig],
})
export class TransactionModule {}
