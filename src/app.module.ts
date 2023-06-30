import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsModule } from './transactions/transactions.module';
import { configService } from './config/config.service';
import { AntiFraudModule } from './anti-fraud/anti-fraud.module';

@Module({
  imports: [
    TransactionsModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AntiFraudModule
  ],
})
export class AppModule {}
