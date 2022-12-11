import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule } from "@nestjs/config";
import { KnexDatabaseService } from './database/knex/knex-database.service';
import { MongoModule } from './database/mongo/mongo/mongo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TransactionModule,
    MongoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
