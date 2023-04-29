import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { TransactionEntity } from "src/infrastructure/entities/transaction.entity";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
      host: this.config.get<string>('DB_HOST'),
      port: this.config.get<number>('DB_PORT'),
      database: this.config.get<string>('DB_NAME'),
      username: this.config.get<string>('DB_USER'),
      password: this.config.get<string>('DB_PASS'),
      entities: ['../dist/**/*.entity.{ts,js}'],
    };
  }
}