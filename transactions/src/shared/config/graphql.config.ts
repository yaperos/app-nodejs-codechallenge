import { join } from 'path';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';

export const graphqlConfig = GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  playground: true,
  autoSchemaFile: join(process.cwd(), 'src/shared/config/schema.gql'),
});
