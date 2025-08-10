import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

/* Project */
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './cases/transactions';
import { EnvValidation } from './common/validators';
import { KafkaModule } from './common/kafka';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
      validate: EnvValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
        minPoolSize: +configService.get('DB_MIN_CONNECTIONS') || 0,
        poolSize: +configService.get('DB_MAX_CONNECTIONS') || 10,
        logging: /true/.test(configService.get<string>('DB_LOGGER') ?? ''),
      }),
    }),
    KafkaModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {}
}
