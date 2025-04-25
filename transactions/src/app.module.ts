import { Module } from '@nestjs/common';
import { TransactionModule } from './modules/transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from '../dbConfig';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), TransactionModule],
})
export class AppModule {}
