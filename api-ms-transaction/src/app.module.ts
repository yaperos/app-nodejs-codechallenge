import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from './transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfiguration } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfiguration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: AppConfiguration().database.host,
      port: AppConfiguration().database.port,
      username: AppConfiguration().database.username,
      password: AppConfiguration().database.password,
      database: AppConfiguration().database.database,
      autoLoadEntities: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
