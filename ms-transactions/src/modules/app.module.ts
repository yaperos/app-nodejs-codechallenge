import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsModule } from './transactions/transactions.module';
import { TracingMiddleware } from '../middlewares/tracing.middleware';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/yape-anti-fraud'),
    TransactionsModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TracingMiddleware)
      .forRoutes('*');
  }
}
