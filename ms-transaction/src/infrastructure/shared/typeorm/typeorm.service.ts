import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '../../config.service';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.config.get('DATABASE_HOST'),
      port: Number(this.config.get('DATABASE_PORT')),
      database: this.config.get('DATABASE_NAME'),
      username: this.config.get('DATABASE_USER'),
      password: this.config.get('DATABASE_PASSWORD'),
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsTableName: 'typeorm_migrations',
      logger: 'debug',
      synchronize: true, // never use TRUE in production!
    };
  }
}
