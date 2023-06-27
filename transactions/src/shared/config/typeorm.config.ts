import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '@transactions/domain/transaction.entity';

export const typeOrmConfig = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): PostgresConnectionOptions => ({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USER'),
    database: configService.get('DB_NAME'),
    password: configService.get('DB_PASSWORD'),
    entities: [Transaction],
    synchronize: true,
  }),
});
