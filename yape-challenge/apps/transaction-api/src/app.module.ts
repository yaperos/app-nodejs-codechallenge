import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionModule } from './transaction/transaction.module';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/yape-db'),
    TransactionModule
  ]
})
export class AppModule {}
