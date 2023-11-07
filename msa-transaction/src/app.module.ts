import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { OrmConfig } from './config/orm.config';
import serviceConfiguration from './config/service-configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      isGlobal: true,
      load: [serviceConfiguration],
    }),
    TypeOrmModule.forRoot({
      ...OrmConfig,
      keepConnectionAlive: true,
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule {}
