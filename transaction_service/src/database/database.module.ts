// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Transaction } from '../transactions/entities/transaction.entity'; // Adjust path

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('app.database.url'),
        entities: [Transaction],
        synchronize: true, // Set to false in production
        logging: process.env.NODE_ENV === 'development',
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule { }