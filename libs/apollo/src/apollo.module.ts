import { DynamicModule, Module } from '@nestjs/common';
import { ApolloService } from './apollo.service';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { join } from 'path';

@Module({
  providers: [ApolloService],
  exports: [ApolloService],
})
export class ApolloModule {
  static register(): DynamicModule {
    return {
      module: ApolloModule,
      imports: [
        GraphQLModule.forRoot<ApolloFederationDriverConfig>({
          driver: ApolloFederationDriver,
          autoSchemaFile: {
            path: join(__dirname, 'schema.gql'),
            federation: 2,
          },
        }),
      ],
    };
  }
}
