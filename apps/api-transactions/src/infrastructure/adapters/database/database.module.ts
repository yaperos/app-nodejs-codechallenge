import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConfigType } from '@nestjs/config';
import config from 'config';
import { MongooseModule } from '@nestjs/mongoose'
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigType<typeof config>) => {
        const {
          connection,
          host,
          port,
          dbName,
        } = configService.mongo;
        return {
          uri : `${connection}://${host}:${port}`,
          dbName,
        };
      },
      inject: [config.KEY]
    }),
  ],
  exports: [MongooseModule]
})
export class DatabaseModule { }
