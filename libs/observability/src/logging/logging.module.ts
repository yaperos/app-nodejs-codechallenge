import { type DynamicModule, Global, Module } from '@nestjs/common';
import { createPinoLogger, PinoLoggerService } from './pino-logger.service';

@Global()
@Module({})
export class LoggingModule {
    static forRoot(serviceName: string): DynamicModule {
        const loggerProvider = {
            provide: PinoLoggerService,
            useValue: createPinoLogger(serviceName),
        };

        return {
            module: LoggingModule,
            providers: [loggerProvider],
            exports: [loggerProvider],
        };
    }

    static forRootAsync(options: {
        inject?: any[];
        useFactory: (...args: any[]) => string | Promise<string>;
    }): DynamicModule {
        const loggerProvider = {
            provide: PinoLoggerService,
            useFactory: async (...args: any[]) => {
                const serviceName = await options.useFactory(...args);
                return createPinoLogger(serviceName);
            },
            inject: options.inject || [],
        };

        return {
            module: LoggingModule,
            providers: [loggerProvider],
            exports: [loggerProvider],
        };
    }
}
