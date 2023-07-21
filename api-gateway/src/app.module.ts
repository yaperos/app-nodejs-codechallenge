import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from 'path';
import { TransfertypesModule } from './transfertypes/transfertypes.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from '@nestjs/config';
import { configLoader } from './config/config-loader';
import { KafkaModule } from './kafka/kafka.module';
import { TransactionstatusModule } from './transactionstatus/transactionstatus.module';


@Module({
  imports: [

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql")
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: "postgres",//process.env.DATABASE_USERNAME,
      password: "postgres",//String(process.env.DATABASE_PASSWORD) ,
      database: process.env.DATABASE_USERNAME,
      entities: [ __dirname + '/**/*.entity{.ts,.js}',],
      synchronize: true
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configLoader]
    }),
    TransactionsModule,
    TransfertypesModule,
    KafkaModule,
    TransactionstatusModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
