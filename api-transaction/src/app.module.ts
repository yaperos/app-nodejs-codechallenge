import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomConfigModule } from './common/config/custom-config';
import { CustomGraphQLModule } from './common/config/custom-graphql';
import { TypeOrmConfigService, TypeOrmDatabaseModule } from './common/config/database';
import { TransactionKafkaConfigService } from './common/config/kafka';
import { ExceptionFilter } from './common/filters/exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TimeOutInterceptor } from './common/interceptors/timeout.interceptor';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    CustomConfigModule,
    CustomGraphQLModule,
    TypeOrmDatabaseModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TypeOrmConfigService,
    TransactionKafkaConfigService,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeOutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ResponseInterceptor,
    // },
  ],
})
export class AppModule { }
