import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { join } from 'path';

@Injectable()
export class ApolloGraphQLFactory implements GqlOptionsFactory {
  constructor(private configService: ConfigService) {}

  createGqlOptions(): Omit<Record<string, any>, 'driver'> {
    const plugins = [];
    if (this.configService.get<string>('NODE_ENV') !== 'production') {
      plugins.push(
        ApolloServerPluginLandingPageLocalDefault({ footer: false }),
      );
    }
    return {
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      formatError: (error: GraphQLError): GraphQLFormattedError => {
        return {
          message: error?.message,
          path: error?.path,
          extensions: {
            code: error?.extensions['code'] ?? HttpStatus.INTERNAL_SERVER_ERROR,
            message: error?.extensions['message'] ?? error?.message,
          },
        };
      },
      plugins,
    };
  }
}
