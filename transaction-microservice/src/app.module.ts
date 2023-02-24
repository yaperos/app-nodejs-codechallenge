import { Module } from '@nestjs/common';
import { TransactionModule } from './modules/transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => DatabaseConfig.get,
    }),
    TransactionModule,
  ],
})
export class AppModule {}
