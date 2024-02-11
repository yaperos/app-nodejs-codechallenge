import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        server: {
          playground: false,
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
          formatError: (error: GraphQLError) => {
            const graphQLFormattedError: GraphQLFormattedError = {
              message: error?.message,
            };
            return graphQLFormattedError;
          },
        },
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              {
                name: 'transaction',
                url: configService.get<string>('TRANSACTION_MS_SERVICE_URL'),
              },
            ],
            subgraphHealthCheck: true,
          }),
        },
      }),
    }),
  ],
})
export class ApolloGatewayModule {}
