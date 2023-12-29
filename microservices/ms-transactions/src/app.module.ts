import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import configurations from './config/configurations';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaService } from './services/kafka.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: +configService.get<number>('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Don't use this option for prod mode
        keepConnectionAlive: true,
        timezone: 'UTC',
        ssl: configService.get('database.ssl'),
        extra: configService.get('database.ssl')
          ? {
              ssl: {
                rejectUnauthorized: false,
              },
            }
          : null,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService, KafkaService],
})
export class AppModule {}
