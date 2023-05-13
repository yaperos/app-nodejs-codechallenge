import { Module } from '@nestjs/common';
import { TransactionsModule } from './transactions/transactions.module';
import { GraphQLModule} from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';


@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql']
    }),
     TransactionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
