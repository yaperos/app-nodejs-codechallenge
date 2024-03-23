import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import ormconfig from '../ormconfig';
import { graphqlmodule } from './transaction/graphql/graphql.module';


@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), TransactionModule, graphqlmodule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}