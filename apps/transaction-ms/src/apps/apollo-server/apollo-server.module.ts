import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { DynamicModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import { GraphQLFormattedError } from 'graphql';

type Params = {
  orphanedTypes?: (object | Function)[];
};

@Module({})
export class ApolloServerModule {
  static forRoot(options?: Params): DynamicModule {
    return {
      module: ApolloServerModule,
      imports: [
        GraphQLModule.forRoot<ApolloFederationDriverConfig>({
          driver: ApolloFederationDriver,
          playground: false,
          buildSchemaOptions: {
            orphanedTypes: options?.orphanedTypes,
          },
          plugins: [
            ApolloServerPluginLandingPageLocalDefault(),
            ApolloServerPluginInlineTrace(),
          ],
          autoSchemaFile: {
            path: join(__dirname, 'schema.gql'),
            federation: 2,
          },
          formatError: (error: GraphQLFormattedError) => {
            const originalError = error.extensions
              ?.originalError as GraphQLFormattedError;
            if (!originalError) {
              return {
                message: error.message,
                code: error.extensions?.code,
              };
            }
            return {
              message: originalError.message,
              code: error.extensions?.code,
            };
          },
        }),
      ],
    };
  }
}
