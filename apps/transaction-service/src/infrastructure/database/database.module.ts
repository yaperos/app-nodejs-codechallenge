import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDrizzleClient, type DrizzleClient } from './drizzle.config';

export const DRIZZLE_CLIENT = Symbol('DRIZZLE_CLIENT');

@Global()
@Module({
    providers: [
        {
            provide: DRIZZLE_CLIENT,
            inject: [ConfigService],
            useFactory: (configService: ConfigService): DrizzleClient => {
                const connectionString = configService.get<string>('DATABASE_URL');
                if (!connectionString) {
                    throw new Error('DATABASE_URL environment variable is required');
                }
                return createDrizzleClient(connectionString);
            },
        },
    ],
    exports: [DRIZZLE_CLIENT],
})
export class DatabaseModule {}
