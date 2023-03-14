import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    TransactionModule,
    MongooseModule.forRoot('mongodb://localhost/transactions'),
  ],
})
export class AppModule {}
