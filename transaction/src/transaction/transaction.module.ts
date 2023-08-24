import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Transaction } from './transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    ClientsModule.register([{
      name: 'ANTI_FRAUD_SERVICE',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'anti-fraud',
          brokers: [process.env.KAFKA_HOST]
        },
        consumer: {
          groupId: 'anti-fraud-consumer'
        }
      }
    }]),
  ],
  providers: [TransactionService],
  controllers: [TransactionController]
})
export class TransactionModule {}
