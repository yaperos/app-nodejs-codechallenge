import { type DynamicModule, Global, Module } from '@nestjs/common';
import type { KafkaModuleOptions } from './kafka.config';
import { KAFKA_OPTIONS } from './kafka.constants';
import { KafkaConsumerService } from './kafka.consumer';
import { KafkaProducerService } from './kafka.producer';

export interface KafkaModuleAsyncOptions {
    isGlobal?: boolean;
    useFactory: (...args: any[]) => KafkaModuleOptions | Promise<KafkaModuleOptions>;
    inject?: any[];
}

@Global()
@Module({})
export class KafkaModule {
    static forRoot(options: KafkaModuleOptions & { isGlobal?: boolean }): DynamicModule {
        return {
            module: KafkaModule,
            global: options.isGlobal ?? true,
            providers: [
                {
                    provide: KAFKA_OPTIONS,
                    useValue: options,
                },
                KafkaProducerService,
                KafkaConsumerService,
            ],
            exports: [KafkaProducerService, KafkaConsumerService],
        };
    }

    static forRootAsync(options: KafkaModuleAsyncOptions): DynamicModule {
        return {
            module: KafkaModule,
            global: options.isGlobal ?? true,
            providers: [
                {
                    provide: KAFKA_OPTIONS,
                    inject: options.inject || [],
                    useFactory: options.useFactory,
                },
                KafkaProducerService,
                KafkaConsumerService,
            ],
            exports: [KafkaProducerService, KafkaConsumerService],
        };
    }
}
