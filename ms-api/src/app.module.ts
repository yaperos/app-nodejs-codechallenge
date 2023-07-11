import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionsModule } from './transactions/transactions.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TransactionsModule,
    MongooseModule.forRoot('mongodb://localhost:27017/yape'),
  ]
})
export class AppModule {}
