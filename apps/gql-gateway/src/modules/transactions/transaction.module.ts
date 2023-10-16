import { Module } from '@nestjs/common';
import { TransactionResolver } from './transaction.resolver';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from 'modules/logger/logger.module';

@Module({
  imports: [HttpModule, LoggerModule.forRoot('GQL Gateway - GraphQL Service')],
  providers: [TransactionResolver],
})
export class TransactionModule {}
