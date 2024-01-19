import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseConfigFactory } from './database.config';
import { TypeOrmFactory } from './typeorm.factory';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfigFactory)],
      inject: [ConfigService],
      useClass: TypeOrmFactory,
    }),
  ],
})
export class DatabaseModule {}
