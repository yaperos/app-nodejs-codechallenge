import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/domain/transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from '../domain/transaction.service';
import { LoggerModule } from '../infraestructure/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
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
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
