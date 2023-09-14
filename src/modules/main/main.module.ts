import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

import { ConfigModule } from '../config/config.module';
import { options } from '../config/options/config.options';
import { TransactionModule } from '../transactions/transaction.module';
import { databaseConfigLoader } from '../config/loaders/database.loader';
import { DatabaseConfigType } from '../config/types/database.type';
import { transactionRepository } from '../transactions/infrastructure/custom-providers.ts/custom-providers';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfigLoader)],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<DatabaseConfigType>('database');
        return {
          type: config.type,
          host: config.host,
          port: config.port,
          username: config.username,
          password: config.password,
          database: config.database,
          synchronize: config.synchronize,
          autoLoadEntities: config.autoLoadEntities,
          migrationsTableName: config.migrationsTableName,
          migrations: [process.cwd() + config.migrationsPath],
          migrationsRun: config.runMigrations,
          keepConnectionAlive: true,
          entities: [],
          cli: {
            migrationsDir: 'database/migration',
          },
        } as TypeOrmModuleAsyncOptions;
      },
    }),
    ConfigModule.forRoot(options),
    TransactionModule,
  ],
  providers: [transactionRepository],
  exports: [transactionRepository],
})
export class MainModule {}
