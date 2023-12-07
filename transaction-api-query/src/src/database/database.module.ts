import { Module } from '@nestjs/common';
import { DataBaseService } from './database.service';

import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from './transaction.schema';

import databaseConfig from '../configs/database.config';
@Module({
  imports: [
    MongooseModule.forRoot(databaseConfig.url),
    MongooseModule.forFeature([
      { name: 'Transaction', schema: TransactionSchema },
    ]),
  ],
  providers: [DataBaseService],
  exports: [DataBaseService],
})
export class DatabaseModule {}
