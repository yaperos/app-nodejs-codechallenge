import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { dbConfig } from './config/db.config';
import { Transaction } from './entity/transaction.entity';
import { KafkaConfigService } from './config/kafka-config.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig.getTypeOrmConfig()),
    TypeOrmModule.forFeature([Transaction]),
    KafkaConfigService.registerModuleKafka(),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
