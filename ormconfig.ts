// ormconfig.ts

import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export default {
  type: 'postgres',
  host: configService.get('DATABASE_HOST', 'localhost'),
  port: configService.get<number>('DATABASE_PORT', 5432),
  username: configService.get('DATABASE_USERNAME', 'myuser'),
  password: configService.get('DATABASE_PASSWORD', 'mypassword'),
  database: configService.get('DATABASE_NAME', 'mydatabase'),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};
