import { Module } from '@nestjs/common';
import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionController } from './transaction.controller';
import { ConfigModule } from '../config/config.module';
import * as process from 'process';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  providers: [
    TransactionResolver, 
    TransactionService
  ],
  imports:[
    ConfigModule,
    TypeOrmModule.forFeature([ Transaction ]),
    ClientsModule.register([
      {
        name: 'KAFKA',
        transport: Transport.KAFKA,
        options: {
          consumer: {
            groupId: process.env.BROKER_CONSUMER,
          },
          client: {
            brokers: [process.env.BROKER_SERVER],
            ssl: true,
            sasl: {
              mechanism: 'plain',
              username: process.env.BROKER_USERNAME,
              password: process.env.BROKER_PASSWORD
            }
            
          },
        }
      },
    ]),
  ],
  controllers: [TransactionController]
})
export class TransactionModule {}
