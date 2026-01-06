import { type DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDrizzleClient, type DatabaseConfig, type DrizzleClient } from './database.config';
import { DATABASE_OPTIONS, DRIZZLE_CLIENT } from './database.constants';

export interface DatabaseModuleOptions {
    isGlobal?: boolean;
}

@Global()
@Module({})
export class DatabaseModule {
    static forRoot(options: DatabaseModuleOptions = {}): DynamicModule {
        return {
            module: DatabaseModule,
            global: options.isGlobal ?? true,
            providers: [
                {
                    provide: DATABASE_OPTIONS,
                    useValue: options,
                },
                {
                    provide: DRIZZLE_CLIENT,
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService): DrizzleClient => {
                        const databaseUrl = configService.get<string>('DATABASE_URL');
                        if (!databaseUrl) {
                            throw new Error('DATABASE_URL environment variable is required');
                        }
                        const config: DatabaseConfig = {
                            url: databaseUrl,
                        };
                        return createDrizzleClient(config);
                    },
                },
            ],
            exports: [DRIZZLE_CLIENT],
        };
    }

    static forRootAsync(options: {
        isGlobal?: boolean;
        useFactory: (...args: any[]) => DatabaseConfig | Promise<DatabaseConfig>;
        inject?: any[];
    }): DynamicModule {
        return {
            module: DatabaseModule,
            global: options.isGlobal ?? true,
            providers: [
                {
                    provide: DATABASE_OPTIONS,
                    useValue: { isGlobal: options.isGlobal },
                },
                {
                    provide: DRIZZLE_CLIENT,
                    inject: options.inject || [],
                    useFactory: async (...args: any[]): Promise<DrizzleClient> => {
                        const config = await options.useFactory(...args);
                        return createDrizzleClient(config);
                    },
                },
            ],
            exports: [DRIZZLE_CLIENT],
        };
    }
}
