import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import {join} from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule} from './transaction/transaction.module';
import { TransactionStatusModule } from './transaction-status/transaction-status.module';
import { TransactionTypeModule } from './transaction-type/transaction-type.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'codechallenge',
      entities: [__dirname + '/**/.entity{.ts,.js}'],
      synchronize: true, 
      autoLoadEntities:true,
    }),
    TransactionModule,
    TransactionStatusModule,
    TransactionTypeModule
  ], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}