import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transaction.entity';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [
    ClientsModule.register([
      {
        name: 'ANTIFRAUD_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'antifraud',
            brokers: ['kafka:9092']
          },
          consumer: {
            groupId: 'antifraud-service-consumer'
          }
        }
      }
    ]),
    TypeOrmModule.forFeature([Transaction])
  ],
})
export class TransactionsModule {}
