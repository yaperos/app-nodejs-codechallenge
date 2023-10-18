import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { LoggerModule } from './shared/logger/logger.module';
import { HttpExceptionFilter } from './shared/HttpExceptionFilter';
import { APP_FILTER } from '@nestjs/core';
import { EventModule } from './shared/event/EventModule';
import { DataSourceEnum } from './shared/config/DataSourceEnum';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TransactionModule,
    LoggerModule,
    TypeOrmModule.forRoot({
      name: DataSourceEnum.db_yape,
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      entities: [path.join(__dirname, './**/*/*.entity{.ts,.js}')],
      migrations: [path.join(__dirname, './migrations/{.ts,.js}')],
      synchronize: false,
      useUTC: true,
      extra: {
        max: 1000,
      },
    }),
    EventModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
