import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';

@Global()
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: [
        'src/shared/infrastructure/graphql/**.gql',
        'dist/src/shared/infrastructure/graphql/**.gql',
      ],
      installSubscriptionHandlers: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  exports: [],
})
export class CoreModule {}
