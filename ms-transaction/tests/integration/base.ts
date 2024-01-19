import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';

export const TypeOrmTestingModule = () => [
  TypeOrmModule.forRoot({
    type: 'better-sqlite3',
    database: ':memory:',
    dropSchema: true,
    autoLoadEntities: true,
    synchronize: true,
  }),
];

export const CacheTestingModule = () => [
  CacheModule.register({
    ttl: 0,
  }),
];
