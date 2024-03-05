import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule} from '@nestjs/typeorm'
import { Transaction } from './transaction.entity';
import { Type } from '../type/type.entity';
import { Status } from '../status/status.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Transaction,Type,Status])],
  controllers: [TransactionsController],
  providers: [TransactionsService]
})
export class TransactionsModule {}
