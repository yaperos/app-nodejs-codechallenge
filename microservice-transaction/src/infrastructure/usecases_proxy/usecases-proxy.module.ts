import { DynamicModule, Module } from '@nestjs/common';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from '../logger/logger.service';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { UseCaseProxy } from './usecases-proxy';
import { CreateTransactionUseCase } from '@/usecases/create.transaction.usecases';
import { RepositoriesService } from '../repositories/repositories.service';
import { ReadTransactionUseCase } from '@/usecases/read.transaction.usecases';
import { ReadOneTransactionUseCase } from '@/usecases/readone.transaction.usecases';
import { UpdateTransactionUseCase } from '@/usecases/update.transaction.usecases';
import { RepositoriesModule } from '../repositories/repositories.module';

@Module({
  imports: [
    LoggerModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    ExceptionsModule,
  ],
})
export class UsecasesProxyModule {
  static GET_TRANSACTION_USECASES_PROXY = 'getTransactionUsecasesProxy';
  static GET_TRANSACTION_BY_ID_USECASES_PROXY = 'getTransactionUsecasesProxy';
  static POST_TRANSACTION_USECASES_PROXY = 'postTransactionUsecasesProxy';
  static PUT_TRANSACTION_USECASES_PROXY = 'putTransactionUsecasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          inject: [LoggerService, RepositoriesService],
          provide: UsecasesProxyModule.POST_TRANSACTION_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            todoRepository: RepositoriesService,
          ) =>
            new UseCaseProxy(
              new CreateTransactionUseCase(logger, todoRepository),
            ),
        },
        {
          inject: [LoggerService, RepositoriesService],
          provide: UsecasesProxyModule.GET_TRANSACTION_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            todoRepository: RepositoriesService,
          ) =>
            new UseCaseProxy(
              new ReadTransactionUseCase(logger, todoRepository),
            ),
        },
        {
          inject: [LoggerService, RepositoriesService],
          provide: UsecasesProxyModule.GET_TRANSACTION_BY_ID_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            todoRepository: RepositoriesService,
          ) =>
            new UseCaseProxy(
              new ReadOneTransactionUseCase(logger, todoRepository),
            ),
        },
        {
          inject: [LoggerService, RepositoriesService],
          provide: UsecasesProxyModule.PUT_TRANSACTION_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            todoRepository: RepositoriesService,
          ) =>
            new UseCaseProxy(
              new UpdateTransactionUseCase(logger, todoRepository),
            ),
        },
      ],
      exports: [
        UsecasesProxyModule.POST_TRANSACTION_USECASES_PROXY,
        UsecasesProxyModule.GET_TRANSACTION_USECASES_PROXY,
        UsecasesProxyModule.GET_TRANSACTION_BY_ID_USECASES_PROXY,
        UsecasesProxyModule.PUT_TRANSACTION_USECASES_PROXY,
      ],
    };
  }
}
