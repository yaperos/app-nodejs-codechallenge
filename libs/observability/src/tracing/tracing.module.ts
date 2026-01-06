import { type DynamicModule, Global, Module } from '@nestjs/common';
import type { TelemetryConfig } from './otel';

@Global()
@Module({})
export class TracingModule {
    static forRoot(config: TelemetryConfig): DynamicModule {
        return {
            module: TracingModule,
            providers: [
                {
                    provide: 'TELEMETRY_CONFIG',
                    useValue: config,
                },
            ],
            exports: ['TELEMETRY_CONFIG'],
        };
    }

    static forRootAsync(options: {
        inject?: any[];
        useFactory: (...args: any[]) => TelemetryConfig | Promise<TelemetryConfig>;
    }): DynamicModule {
        return {
            module: TracingModule,
            providers: [
                {
                    provide: 'TELEMETRY_CONFIG',
                    useFactory: options.useFactory,
                    inject: options.inject || [],
                },
            ],
            exports: ['TELEMETRY_CONFIG'],
        };
    }
}
