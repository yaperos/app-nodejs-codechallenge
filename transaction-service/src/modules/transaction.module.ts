import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Transaction, TransactionStatus, TransactionType } from 'src/entities';
import { DataLoaderService } from 'src/services/dataloader/dataloader.service';
import { TransactionService } from 'src/services/transaction/transaction.service';
import { TransactionResolver } from 'src/resolvers/transaction.resolver';
import ConfigKafkaProvider from 'src/providers/kafka.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionStatus, TransactionType]),
  ],
  providers: [
    ConfigKafkaProvider,
    DataLoaderService,
    TransactionService,
    TransactionResolver,
  ],
  exports: [DataLoaderService],
})
export class TransactionModule {}
