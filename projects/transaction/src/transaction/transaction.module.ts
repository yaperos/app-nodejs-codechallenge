import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Transaction } from './models/transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransationService } from './transaction.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            brokers: [`${process.env.KAFKA_HOST}:9092`],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ]),
    TypeOrmModule.forFeature([Transaction]),
  ],
  providers: [TransationService],
  controllers: [TransactionController],
})
export class TransactionModule {}
