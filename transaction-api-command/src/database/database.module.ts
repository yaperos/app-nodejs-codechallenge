import { Module } from '@nestjs/common';
import { DataBaseService } from './database.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import databaseConfig from './../configs/database.config';
import { Transaction } from './transaction.entity';
import { OutBox } from './outbox.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...databaseConfig,
    }),
    TypeOrmModule.forFeature([Transaction, OutBox]),
  ],
  providers: [DataBaseService],
  exports: [DataBaseService],
})
export class DatabaseModule {}
