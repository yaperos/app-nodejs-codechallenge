import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from '../controller/transaction.controller';
import { TransactionService } from 'src/core/service/transaction.service';
import { Transaction } from 'src/domain/entity/transaction.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionListener } from '../../core/listener/transaction.listener';
import * as dotenv from 'dotenv';
import { CacheModule } from '@nestjs/cache-manager';
dotenv.config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTIFRAUD-BCP',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_SERVER],
          },
          consumer: {
            groupId: 'bcp-group',
          },
        },
      },
    ]
    ),
  TypeOrmModule.forFeature([Transaction]),
  CacheModule.register(),
 ],
  controllers: [TransactionController, TransactionListener],
  providers: [TransactionService, Logger]
})
export class TransactionModule {}
