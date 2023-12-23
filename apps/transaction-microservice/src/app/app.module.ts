import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionRepository } from './transaction.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { enviroments } from '@app-nodejs-codechallenge/shared/env';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '@app-nodejs-codechallenge/shared/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mongodb',
        url:  config.get('URL_MONGODB'),
        entities: [
          Transaction
        ],
        synchronize: true,
        logging: true,
      }),
    }),
    
    TypeOrmModule.forFeature([Transaction])
  ],
  controllers: [AppController],
  providers: [AppService, TransactionRepository],
})
export class AppModule { }
