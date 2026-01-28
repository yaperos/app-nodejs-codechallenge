import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsModule } from './transactions/transactions.module';
import { AntiFraudModule } from './anti-fraud/anti-fraud.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';  

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'transactions.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TransactionsModule,
    AntiFraudModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}