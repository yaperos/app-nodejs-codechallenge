import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from './transaction.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [ 
    ClientsModule.register([
      {
        name: 'KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            // brokers: [`${ process.env.KAFKA_HOST }:9092`],
            brokers: ['localhost:9092']
          },
          consumer: {
            groupId: 'transaction-consumer',
          }
        }
      }
    ]),
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionResolver]
})
export class TransactionModule {}
