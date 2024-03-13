import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';

export const GraphQLConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: join(
    process.cwd(),
    'src/infraestructure//graphql/schema.gql',
  ),
};
