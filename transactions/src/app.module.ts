import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import env from './confi/env';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.DB.HOST,
      port: env.DB.PORT,
      username: env.DB.USERNAME,
      password: env.DB.PASSWORD,
      database: env.DB.DATABASE,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: env.DB.SINCRONIZE,
    }),
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
