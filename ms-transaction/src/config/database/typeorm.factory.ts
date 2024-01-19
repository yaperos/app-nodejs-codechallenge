import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { DATABASE_CONFIG_KEY, DatabaseConfig } from './database.config';

@Injectable()
export class TypeOrmFactory implements TypeOrmOptionsFactory {
  protected config: DatabaseConfig;

  constructor(private configService: ConfigService) {
    this.config = this.configService.get<DatabaseConfig>(DATABASE_CONFIG_KEY);
  }

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    if (this.configService.get<string>('NODE_ENV') !== 'test') {
      return {
        type: 'postgres',
        host: this.config.host,
        port: this.config.port,
        username: this.config.username,
        password: this.config.password,
        database: this.config.database,
        entities: ['dist/**/*.entity.js'],
      };
    } else {
      return {
        type: 'better-sqlite3',
        database: ':memory:',
        dropSchema: true,
        autoLoadEntities: true,
        entities: ['src/**/*.entity.ts'],
        synchronize: true,
      };
    }
  }
}
