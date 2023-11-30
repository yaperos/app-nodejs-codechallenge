import { join } from 'path';
import { DynamicModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';

type Params = {
  // eslint-disable-next-line @typescript-eslint/ban-types
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
        }),
      ],
    };
  }
}
