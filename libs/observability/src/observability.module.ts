import { AllExceptionsFilter } from '@app/common';
import { type DynamicModule, Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { CompositeLoggerAdapter } from './adapters/composite-logger.adapter';
import { ConsoleLoggerAdapter } from './adapters/console-logger.adapter';
import { SentryLoggerAdapter } from './adapters/sentry-logger.adapter';
import { LoggerService } from './logger.service';
import { type ILogger, LOGGER_PORT } from './ports/logger.port';

export interface ObservabilityModuleOptions {
    serviceName: string;
    enableSentry?: boolean;
    sentryDsn?: string;
    environment?: string;
}

@Global()
@Module({})
export class ObservabilityModule {
    static forRoot(options: ObservabilityModuleOptions): DynamicModule {
        const loggers: ILogger[] = [];
        const imports: any[] = [];

        loggers.push(new ConsoleLoggerAdapter(options.serviceName));

        if (options.enableSentry && options.sentryDsn) {
            loggers.push(new SentryLoggerAdapter(options.serviceName));

            imports.push(SentryModule.forRoot());
        }

        const compositeLogger = loggers.length > 1 ? new CompositeLoggerAdapter(loggers) : loggers[0];

        const providers: any[] = [
            {
                provide: LOGGER_PORT,
                useValue: compositeLogger,
            },
            LoggerService,
        ];

        if (options.enableSentry && options.sentryDsn) {
            providers.push({
                provide: APP_FILTER,
                useClass: SentryGlobalFilter,
            });
        } else {
            providers.push({
                provide: APP_FILTER,
                inject: [LoggerService],
                useFactory: (logger: LoggerService) => {
                    return new AllExceptionsFilter(logger);
                },
            });
        }

        return {
            module: ObservabilityModule,
            global: true,
            imports,
            providers,
            exports: [LOGGER_PORT, LoggerService],
        };
    }
}
