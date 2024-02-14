import { Transaction } from 'src/entities/transaction.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaService } from './service-core/kafka.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { enviroments } from './enviroments';
import config from './config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { upperDirectiveTransformer } from './common/directives/upper-case.directive';
import { TransactionResolver } from './service/transaction.resolve';
import { TransactionService } from './service/transaction.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: 'schema.gql',
      transformSchema: schema => upperDirectiveTransformer(schema, 'upper'),
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
      driver: ApolloDriver,
    }),
    TypeOrmModule.forFeature([Transaction]),
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env',
      load: [config],
      isGlobal: true,
    }),
    DatabaseModule,
  ],
  controllers: [],
  providers: [KafkaService, TransactionResolver, TransactionService],
})
export class AppModule {}