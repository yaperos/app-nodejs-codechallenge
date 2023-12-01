import { Module } from '@nestjs/common';
import { TransactionModule } from './modules/transaction/TransactionModule';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './Shared/PrismaModule';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: false }),
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(
        process.cwd(),
        'src/Shared/infrastructure/graphql/schema.gql',
      ),
      playground: true,
      context: ({ req }) => ({ request: req }),
      sortSchema: true,
    }),
    TransactionModule,
  ],
})
export class AppModule {}
