import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { databaseConfigLoader } from '../config/loaders/database.loader';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfigType } from '../config/types/database.type';
import { options } from '../config/options/config.options';
import { TransactionEntity } from '../transaction/entities/transaction.entity';
import {
  exceptionFilter,
  exceptionMapper,
  transformInterceptor,
} from './custom-providers/custom-providers';

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
          entities: [TransactionEntity],
          cli: {
            migrationsDir: 'database/migration',
          },
        } as TypeOrmModuleAsyncOptions;
      },
    }),
    ConfigModule.forRoot(options),
  ],
  providers: [exceptionFilter, exceptionMapper, transformInterceptor],
})
export class CoreModule {}
