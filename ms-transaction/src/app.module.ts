import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { DatabaseModule } from './infrastructure/database/database.module';
import { GraphqlApiModule } from './infrastructure/graphql-api/graphql-api.module';
import { HttpModule } from './infrastructure/http/http.module';
import { MessagingModule } from './infrastructure/messaging/mesagging.module';
import { KafkaProducerModule } from './infrastructure/services/kafka/producer/kafka-producer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: process.env.NODE_ENV === 'development',
      context: ({ req }) => ({ request: req }),
    }),
    KafkaProducerModule,
    HttpModule,
    DatabaseModule,
    MessagingModule,
    GraphqlApiModule,
  ],
})
export class AppModule {}
