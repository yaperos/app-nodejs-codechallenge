import { Module } from "@nestjs/common";
import { TransactionsModule } from "./transactions/transactions.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver } from "@nestjs/apollo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { KafkaModule } from "./kafka/kafka.module";
import { TransactionsConsumer } from "./transactions/transactions.consumer";
import { typeOrmConfigAsync } from "./config/typeorm.config";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: "./src/schema.gql",
    }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    ConfigModule.forRoot({
      envFilePath: "./.env",
      isGlobal: true,
    }),
    TransactionsModule,
    KafkaModule,
  ],
  providers: [TransactionsConsumer],
})
export class AppModule {}
