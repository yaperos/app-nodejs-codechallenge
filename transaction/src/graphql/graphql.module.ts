import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

import { GRAPHQL_OPTIONS } from '../constants';

@Global()
@Module({
    imports: [
        ConfigModule,
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            useFactory: async(options) => options,
            inject: [GRAPHQL_OPTIONS],
        })
    ],
    providers: [
        {
            provide: GRAPHQL_OPTIONS,
            useFactory: async (configService: ConfigService) => configService.get('config.graphql'),
            inject: [ConfigService],
        }
    ],
    exports: [GraphQLModule, GRAPHQL_OPTIONS]
})
export class GraphqlModule {}
