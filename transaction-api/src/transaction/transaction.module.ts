import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProducerService } from 'src/kafka/producer.service';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [
    KafkaModule,
    TypeOrmModule.forFeature([Transaction]),
    ClientsModule.register([
      {
        name: 'ANTI_FRAUD_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'anti-fraud-consumer',
          },
        },
      },
    ]),
  ],
  providers: [TransactionService, TransactionResolver, ProducerService],
})
export class TransactionModule {}
