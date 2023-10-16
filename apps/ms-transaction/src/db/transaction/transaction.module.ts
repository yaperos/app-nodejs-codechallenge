import { Module } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionDbService } from './transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  exports: [TransactionDbService],
  providers: [TransactionDbService],
})
export class TransactionDbModule {}
