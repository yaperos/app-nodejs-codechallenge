import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { DataSource, LoggerOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    // Use useFactory, useClass, or useExisting
    // to configure the DataSourceOptions.
    useFactory: (configService: ConfigService) =>
      ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        logging: configService.get<LoggerOptions>('DATABASE_LOG_LEVEL'),
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: true,
        reuseConnection: true,
      } as TypeOrmModuleOptions),
    // dataSource receives the configured DataSourceOptions
    // and returns a Promise<DataSource>.
    dataSourceFactory: async (options) => {
      const dataSource = await new DataSource(options).initialize();
      return dataSource;
    },
  }),
];
