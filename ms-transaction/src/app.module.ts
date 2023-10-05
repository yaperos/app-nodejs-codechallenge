import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from '@src/app.controller';
import { TransactionController } from '@src/transaction.controller';
import { KafkaConfigService } from '@src/core/services/kafka-config.services';
import { TransactionModel } from '@src/transaction.model';
import { TransactionServices } from '@src/transaction.services';
import { PrismaService } from '@src/core/services/prisma.services';
import { KafkaMiddleware } from '@src/core/middleware/kafka.middleware';
import { TransactionMiddleware } from '@src/core/middleware/transaction.middlewate';

@Module({
  imports: [],
  controllers: [AppController, TransactionController],
  providers: [
    KafkaConfigService,
    TransactionModel,
    TransactionServices,
    PrismaService,
    KafkaMiddleware,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TransactionMiddleware)
      .forRoutes({ path: 'transaction', method: RequestMethod.POST });
  }
}
