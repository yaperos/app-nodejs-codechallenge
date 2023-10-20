import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from './modules/transaction.module';
import { AntiFraudModule } from './modules/anti-fraud.module';
import OrmConfig = require('../core-library/src/config/orm.config');
import { ConfigModule } from '../core-library/src/config/config.module';


@Module({
  imports: [
    ConfigModule,
    TransactionModule, 
    AntiFraudModule,
    TypeOrmModule.forRoot({...OrmConfig, keepConnectionAlive: true, autoLoadEntities: true})
  ]
})
export class AppModule {}
