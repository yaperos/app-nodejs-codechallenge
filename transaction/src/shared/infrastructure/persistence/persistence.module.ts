import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TransactionPostgres } from 'src/create/infra/transaction.entity';
import { TransactionMongo } from 'src/create/infra/transaction.mongo';

const modules = [
  TypeOrmModule.forRootAsync({
    name: 'postgresConnection',
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get<string>('postgres.host'),
      port: configService.get<number>('postgres.port'),
      username: configService.get<string>('postgres.username'),
      password: configService.get<string>('postgres.password'),
      database: configService.get<string>('postgres.database'),
      synchronize: false,
      autoLoadEntities: true,
      logging: ['error', 'migration', 'schema'],
      migrations: ['src/migrations/*.sql'],
      entities: [TransactionPostgres],
    }),
    inject: [ConfigService],
  }),
  TypeOrmModule.forRootAsync({
    name: 'mongoConnection',
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      type: 'mongodb',
      url: `mongodb://${configService.get<string>('mongo.username')}:${configService.get<string>('mongo.password')}@${configService.get<string>('mongo.host')}/${configService.get<string>('mongo.database')}?retryWrites=true&w=majority&authSource=admin`,
      synchronize: true,
      logging: false,
      entities: [TransactionMongo],
      migrations: [],
      subscribers: [],
      logger: 'debug',
    }),
    inject: [ConfigService],
  }),
];

@Module({
  exports: modules,
  imports: modules,
})
export class PersistenceModule {}
