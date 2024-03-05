import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { EnvironmentService } from "../../environment";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly environmentService: EnvironmentService) { }

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const { host, name, password, port, username } = this.environmentService.database;

    return {
      type: 'postgres',
      host,
      port,
      username,
      password,
      database: name,
      entities: [],
      autoLoadEntities: true,
      synchronize: this.environmentService.environment !== 'production',
    }
  }
}