import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schemas/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'transaction',
      host: 'postgres-yape',
      port: 5432,
      password: 'postgres',
      username: 'postgres',
      entities: [__dirname+'/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: false
    }),
    TransactionModule
  ]
})
export class AppModule { }
