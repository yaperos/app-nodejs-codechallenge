import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { TransactionType } from './entities/transactionType.entity';
import { TransactionStatus } from './entities/transactionStatus.entity';
import { TransactionController } from './transaction.events.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionType, TransactionStatus]),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_CLIENT',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const kafkaBrokers = configService.get('kafka.brokers');
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'hero',
                brokers: kafkaBrokers,
              },
              // consumer: {
              //   groupId: 'hero-consumer',
              // },
              producer: {
                allowAutoTopicCreation: true,
              },
            },
          };
        },
      },
    ]),
  ],
  providers: [TransactionResolver, TransactionService],
  exports: [],
  controllers: [TransactionController],
})
export class TransactionModule {}
