import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrmConfig from '../config/orm.config';
import { TransactionModule } from './module/transaction.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forRoot({ ...OrmConfig, keepConnectionAlive: true, autoLoadEntities: true }), 
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TransactionModule
  ]
})
export class AppModule {}
