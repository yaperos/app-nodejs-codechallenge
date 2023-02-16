import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist';
import { IDatabaseConfig } from '../interfaces/database-config.interface';
import { Transaction, TransactionType, TransactionStatus } from "../entities/index";

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
      entities: [Transaction, TransactionType, TransactionStatus],
      autoLoadEntities: false,
      logger: 'file',
      synchronize: false,
    };
  }
}
