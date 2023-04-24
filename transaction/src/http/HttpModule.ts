import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CoreHttpModule } from './core/CoreHttpModule';
import { HttpExceptionFilter } from './exception/HttpExceptionFilter';
import { MonitorMiddleware } from './middlewares/MonitorMiddleware';
import { TracerMiddleware } from './middlewares/TracerMiddleware';
import { TransactionModule } from '../contexts/transaction/transaction.module';

@Module({
  imports: [TransactionModule, CoreHttpModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class HttpModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TracerMiddleware, MonitorMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
