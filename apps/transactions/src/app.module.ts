import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinancialTransactionModule } from '@/transactions/financial-transactions.module';
import { TypeOrmConfig } from '@/config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfig,
    }),
    FinancialTransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
