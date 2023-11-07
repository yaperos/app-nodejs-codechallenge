import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { OrmConfig } from './config/orm.config';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [
    TransactionModule,
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...OrmConfig,
      keepConnectionAlive: true,
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule {}
