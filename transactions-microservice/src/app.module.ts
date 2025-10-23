import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLResponse } from '@apollo/server';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { StreamingModule } from 'src/streaming/streaming.module';
import { getConfiguration, validateEnvironmentVariables } from 'src/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfiguration],
      validate: validateEnvironmentVariables,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.mongodb'),
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: () => ({
        csrfPrevention: false,
        playground: false,
        autoSchemaFile: 'schema.gql',
        fieldResolverEnhancers: ['interceptors'],
        includeStacktraceInErrorResponses: false,
        sortSchema: true,
        autoTransformHttpErrors: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        context: ({ req, res }: { req: any; res: any }) => ({ req, res }),
        formatResponse: (response: GraphQLResponse): GraphQLResponse => {
          return response;
        },
      }),
    }),
    StreamingModule,
    TransactionsModule,
  ],
})
export class AppModule {}
