import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigType } from '@nestjs/config';
import postgresConfig from './postgres.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [postgresConfig.KEY],
      useFactory: (pg: ConfigType<typeof postgresConfig>) => ({
        type: 'postgres',
        host: pg.host,
        port: pg.port,
        username: pg.user,
        password: pg.password,
        database: pg.database,
        autoLoadEntities: true,
        synchronize: pg.synchronize,
        logging: pg.logging,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmInfraModule {}