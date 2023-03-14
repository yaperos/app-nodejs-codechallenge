import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { HttpLoggingInterceptor } from '@core/interceptor';
import { prometheusProvider } from '@core/config/prometheus';
import { TransactionsModule } from './apps/transaction';
import Joi from 'joi';

@Module({
  imports: [
    TransactionsModule,
    PrometheusModule.register(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(3002),
        APP_NAME: Joi.string().required(),
        DATE_PATTERN: Joi.string().required(),
        TIMESTAMP_FORMAT: Joi.string().required(),
        MAX_SIZE: Joi.string().required(),
        MAX_DAYS: Joi.string().required(),
        KAFKA_HOST: Joi.string().required(),
        KAFKA_PORT: Joi.number().required(),
        KAFKA_NAME: Joi.string().required(),
        KAFKA_CLIENTID: Joi.string().required(),
        KAFKA_GROUPID: Joi.string().required(),
        LOGSTASH_ENABLED: Joi.boolean().required(),
        LOGSTASH_PORT: Joi.number().required(),
        LOGSTASH_NODE_NAME: Joi.string().required(),
        LOGSTASH_HOST: Joi.string().required(),
      }),
    }),
  ],
  providers: [...prometheusProvider],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggingInterceptor)
      .exclude(
        { path: 'metrics', method: RequestMethod.GET },
        { path: 'health', method: RequestMethod.GET },
        { path: 'docs', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
