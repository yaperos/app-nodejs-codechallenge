import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
    AntifraudFeature,
} from '../db';
import {
    configOptions,
} from '../../../../@shared';

export const dbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: configOptions().database.host,
    port: Number(configOptions().database.port),
    username: configOptions().database.username,
    password: configOptions().database.password,
    database: configOptions().database.name,
    entities: [
        AntifraudFeature,
    ],
    synchronize: true,
    autoLoadEntities: true,
};