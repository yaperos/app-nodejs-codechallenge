import { Module } from '@nestjs/common';
import { TransactionstatusService } from './transactionstatus.service';
import { TransactionstatusResolver } from './transactionstatus.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactionstatus } from './entities/transactionstatus.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ Transactionstatus ])],
  providers: [TransactionstatusResolver, TransactionstatusService],
  exports: [TransactionstatusService]
  
})
export class TransactionstatusModule {}
