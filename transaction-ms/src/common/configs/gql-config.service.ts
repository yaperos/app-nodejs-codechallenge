import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import { ApolloServerPluginUsageReporting } from '@apollo/server/plugin/usageReporting';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { GraphQLUUID } from 'graphql-scalars';
import { isProduction } from '../../utils/common.utils';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
    createGqlOptions(): ApolloDriverConfig {
        // Disable tracing in production
        const plugins = [
            isProduction
                ? ApolloServerPluginInlineTraceDisabled()
                : ApolloServerPluginInlineTrace(),
        ];
        // Configure usage reporting in production
        if (process.env.APOLLO_KEY && process.env.APOLLO_GRAPH_REF)
            plugins.push(
                ApolloServerPluginUsageReporting({
                    fieldLevelInstrumentation: isProduction ? 0.1 : 1,
                })
            );

        const uuidScalarResolver = GraphQLUUID;
        uuidScalarResolver.name = 'UUIDScalar';

        return {
            plugins: plugins,
            cache: 'bounded',
            csrfPrevention: isProduction,
            playground: !isProduction,
            resolvers: {
                [uuidScalarResolver.name]: uuidScalarResolver,
            },
            introspection: !isProduction,
            autoSchemaFile: {
                federation: 2,
                path: 'non-federated-temporal.graphql',
            },
            sortSchema: true,
        };
    }
}
