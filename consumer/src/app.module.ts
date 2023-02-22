import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

import {Transaction} from './common/entities/transaction.entity';
import { TransactionModule } from './transaction/transaction.module';
import { AntifraudModule } from './antifraud/antifraud.module';
import { getEnvPath } from './common/helper/env.helper';
import { ConfigModule } from '@nestjs/config';
const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'yape',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
      retryDelay: 3000,
      retryAttempts: 10,
    }),
    TransactionModule,
    AntifraudModule,
    ConfigModule.forRoot({ envFilePath, isGlobal: true })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
