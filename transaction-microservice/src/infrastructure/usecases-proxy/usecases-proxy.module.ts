import { DynamicModule, Module } from '@nestjs/common';
import { CreateTransactionUseCases } from 'src/usecases/createTransaction.usecases';
import { GetTransactionUseCases } from 'src/usecases/getTransaction.usecases';
import { EnvironmentConfigModule } from '../config/environment-config/environment.config.module';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from '../logger/logger.service';
import { RepositoriesModule } from '../repositories/repositories.module';
import { DataBaseTransactionRepository } from '../repositories/transaction.repository';
import { UseCaseProxy } from './usecases-proxy';

@Module({
    imports: [
        LoggerModule,
        RepositoriesModule,
        ExceptionsModule,
        EnvironmentConfigModule
    ]
})
export class UsecasesProxyModule {
    static POST_TRANSACTION_USECASES_PROXY = 'createTransactionUseCasesProxy';
    static GET_TRANSACTION_USERCASES_PROXY = 'getTransactionUseCasesProxy';
    static register():DynamicModule{
        return {
            module: UsecasesProxyModule,
            providers: [
                {
                    inject: [LoggerService, DataBaseTransactionRepository],
                    provide: UsecasesProxyModule.POST_TRANSACTION_USECASES_PROXY,
                    useFactory: (logger: LoggerService, transactionRepository: DataBaseTransactionRepository) => 
                        new UseCaseProxy(new CreateTransactionUseCases(logger, transactionRepository))
                },
                {
                    inject: [LoggerService, DataBaseTransactionRepository],
                    provide: UsecasesProxyModule.GET_TRANSACTION_USERCASES_PROXY,
                    useFactory: (logger: LoggerService, transactionRepository: DataBaseTransactionRepository) => 
                        new UseCaseProxy(new GetTransactionUseCases(logger, transactionRepository))
                },
            ],
            exports: [
                UsecasesProxyModule.POST_TRANSACTION_USECASES_PROXY,
                UsecasesProxyModule.GET_TRANSACTION_USERCASES_PROXY
            ]
        };
    }

}
