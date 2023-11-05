import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { dateScalar } from './infrastructure/graphql/date.resolver';

@Global()
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      resolvers: {
        Date: dateScalar,
      },
      typePaths: [
        'src/shared/infrastructure/graphql/**.gql',
        'dist/src/shared/infrastructure/graphql/**.gql',
      ],
      installSubscriptionHandlers: true,
      formatError: (error) => {
        return {
          message: error.message,
          code: error.extensions?.code,
        };
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  exports: [],
})
export class CoreModule {}
