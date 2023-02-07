import { Module } from '@nestjs/common';

import { TransactionModule } from './transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { LoggerModule } from './shared/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TransactionModule,
    LoggerModule,
    TypeOrmModule.forRoot({
      name: process.env.DB_NAME,
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'db_yape',
      autoLoadEntities: true,
      entities: [path.join(__dirname, './**/*/*.entity{.ts,.js}')],
      migrations: [path.join(__dirname, './migrations/{.ts,.js}')],
      synchronize: false,
      useUTC: true,
    }),
  ],
})
export class AppModule {}
