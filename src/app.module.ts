import { join } from 'path';
import { LoggerModule } from 'nestjs-pino';
import { Logger, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { LoggingMiddleware } from './infra/nest/middlewares/logging.middleware';
import { GlobalModule } from './infra/nest/modules/global.module';
import { TransactionsModule } from './infra/nest/modules/transactions/transaction.module';
import { KafkaModule } from './infra/nest/modules/kafka/kafka.module';
import { AntiFraudModule } from './infra/nest/modules/anti-frauds/anti-fraud.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    GlobalModule,
    TransactionsModule,
    AntiFraudModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV === 'local' ? { target: 'pino-pretty' } : undefined,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT, 10),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    }),
    KafkaModule.register({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [process.env.KAFKA_BROKER],
      ssl: process.env.KAFKA_ENABLE_SSL === 'true',
    }),
  ],
  controllers: [AppController],
  providers: [Logger],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
