import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import { TypeOrmModule} from '@nestjs/typeorm'
import { TypeModule } from './type/type.module';
import { StatusModule } from './status/status.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql')
    }),
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    username: 'root',
    password: 'password',
    port: 3306,
    database: 'transactions',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true
  }),TransactionsModule, TypeModule, StatusModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
