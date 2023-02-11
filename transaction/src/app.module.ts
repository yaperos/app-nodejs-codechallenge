import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransModule } from './transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './transaction/entities/transaction.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.development.env', isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [ ApolloServerPluginLandingPageLocalDefault ]
    }),
    TransModule,
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      database: 'yape',
      port: 27017,
      entities: [TransactionEntity],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
