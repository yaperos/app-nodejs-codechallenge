import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { DatabaseModule } from './database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthsModule } from './auths/auths.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserCardModule } from './user-cars/user-card.module';
import { TransactionModule } from './transaction/transaction.module';
import { KafkaModule } from './kafka/kafka.module';
import { CardTypeModule } from './card-type/card-type.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: './graphql/schema.gql',
      debug: false,
      context: ({ req }) => ({ req }),
    }),
    DatabaseModule,
    UsersModule,
    AuthsModule,
    UserCardModule,
    TransactionModule,
    KafkaModule,
    CardTypeModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
