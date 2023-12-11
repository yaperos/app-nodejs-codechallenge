import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TransactionModule } from './transaction/infrastructure/transaction.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    TransactionModule,
    MongooseModule.forRoot('mongodb://db:27017/transactions'),
  ],
  controllers: [AppController],
})
export class AppModule {}
