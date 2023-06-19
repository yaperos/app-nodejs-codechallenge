import { Module } from '@nestjs/common';
import { TransactionModule } from '../transaction/transaction.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurationYaml from '@nodejs-codechallenge/shared/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configurationYaml],
      isGlobal: true
   }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('application.db.host'),
        port: configService.get<number>('application.db.port'),
        username: configService.get('application.db.username'),
        password: configService.get('application.db.password'),
        database: configService.get('application.db.name'),
        autoLoadEntities: configService.get('application.env') !== 'prod',
        synchronize: configService.get('application.env') !== 'prod',
      }),
    }),
    TransactionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}