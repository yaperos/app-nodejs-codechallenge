import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { TransactionsModule } from './transactions/transactions.module';
import { Transaction } from './transactions/entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true
      }),
    TypeOrmModule.forRootAsync({
        useFactory: process.env.NODE_ENV !== 'production'
        ? ormConfig : ormConfigProd
    }), 
    EventEmitterModule.forRoot(), 
    TransactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}