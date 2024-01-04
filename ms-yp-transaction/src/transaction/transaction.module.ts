import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports: [
    ClientsModule.register([
      {
        name: 'ANTIFRAUD_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'antifraud',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'antifraud-consumer',
          },
        },
      },
    ]),
    TypeOrmModule.forFeature([Transaction]),
  ],
})
export class TransactionModule {}
