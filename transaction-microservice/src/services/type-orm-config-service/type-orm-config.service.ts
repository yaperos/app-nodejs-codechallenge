import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist';
import { IDatabaseConfig } from '../../../src/interfaces/database-config.interface';

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
      autoLoadEntities: true,
      logger: 'file',
      synchronize: false,
    };
  }
}
