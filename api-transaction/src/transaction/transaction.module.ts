import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AntifraudKafkaModule } from 'src/common/config/kafka';
import { TransactionController } from './controllers/transaction.controller';
import { Transaction } from './entities/transaction.entity';
import { TransactionResolver } from './resolvers/transaction.resolver';
import { TransactionService } from './services/transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    AntifraudKafkaModule,
  ],
  controllers: [
    TransactionController,
  ],
  providers: [
    TransactionResolver,
    TransactionService,
  ],
})
export class TransactionModule { }
