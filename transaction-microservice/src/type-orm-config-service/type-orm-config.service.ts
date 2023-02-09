import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist';
import { TransactionType } from 'src/database/entities/transaction.type.entity';
import { IDatabaseConfig } from 'src/interfaces/database-config.interface';
import { TransactionStatus } from '../database/entities/transaction-status.entity';
import { Transaction } from '../database/entities/transaction.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const { host, port, database, username, password } =
      this.configService.get<IDatabaseConfig>('database');

    return {
      type: 'postgres',
      host,
      port,
      database,
      username,
      password,
      entities: [Transaction, TransactionStatus, TransactionType],
      logger: 'file',
      synchronize: false,
    };
  }
}
