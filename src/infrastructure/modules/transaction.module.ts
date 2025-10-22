import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionEntity } from '../database/entities/transaction.entity';
import { TransactionController } from '../../presentation/controllers/transaction.controller';
import { TransactionService } from '../../application/services/transaction.service';
import { TransactionEventService } from '../../application/services/transaction-event.service';
import { TransactionRepository } from '../database/repositories/transaction.repository';
import { TransactionProcessor } from '../../application/processors/transaction.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    BullModule.registerQueue({
      name: 'transactions',
    }),
    BullModule.registerQueue({
      name: 'antifraud',
    }),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction-service',
            brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
          },
          consumer: {
            groupId: 'transaction-group',
          },
        },
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TransactionEventService,
    TransactionProcessor,
    {
      provide: 'ITransactionRepository',
      useClass: TransactionRepository,
    },
  ],
  exports: [TransactionService, TransactionEventService],
})
export class TransactionModule {}