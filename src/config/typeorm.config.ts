import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { EEnvironment } from 'src/common/enums/environment';
import { TypeOrmEntities } from 'src/domain/entities';

export const typeormConfig: TypeOrmModuleAsyncOptions = {
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    synchronize: configService.get('ENV', '') === EEnvironment.DEV,
    entities: [...TypeOrmEntities],
  }),
};
