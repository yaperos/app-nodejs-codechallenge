import { Module } from '@nestjs/common';
import TransactionModule from './transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import TransactionsEntity from './transactions/transactions.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load: [configuration]
    }),
    TransactionModule,
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      useFactory: async (configService:ConfigService) => ({
        type: 'postgres',
        host: configService.get("server.dns"),
        port: configService.get("postgres.port"),
        username: configService.get("postgres.user"),
        password: configService.get("postgres.pass"),
        database: configService.get("postgres.db"),
        entities:[TransactionsEntity],
        synchronize: true
      }),
      inject: [ConfigService]


    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
