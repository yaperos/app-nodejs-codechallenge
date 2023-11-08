import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { ClientsModule } from '@nestjs/microservices';
import { KafkaClient } from 'src/config/kafka.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    ClientsModule.register(KafkaClient),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
