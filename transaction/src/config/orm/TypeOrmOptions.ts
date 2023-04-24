import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class TypeOrmOptions implements TypeOrmOptionsFactory {
  constructor(
    private configService: ConfigService,
  ) {}


  async createTypeOrmOptions(connectionName?: string): Promise<TypeOrmModuleOptions> {
    const pathEntities = path.join(
      __dirname,
      '../',
      '../',
      'contexts/**/*/*.entity{.ts,.js}',
    );

    const type = 'postgres';
    const password = await this.configService.get('POSTGRES_PASS');
    const username = await this.configService.get('POSTGRES_USER');
    const host = await this.configService.get('POSTGRES_HOST');
    const port = await this.configService.get('POSTGRES_PORT');
    const serviceName = await this.configService.get('POSTGRES_BD');


    return {
      name: connectionName,
      type,
      host,
      port,
      username,
      password,
      database: serviceName,
      entities: [pathEntities],
      synchronize: true, // se crea schemas automaticamente en cada inicio de la aplicacion.
    };
  }
}

