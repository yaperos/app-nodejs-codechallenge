import { join } from 'path';
import { CacheModule, Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { UserInterfaceModule } from './user-interface/user-interface.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      ttl: 3600,
      port: 6379,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/microservice/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault],
    }),
    UserInterfaceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
