import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import expressConfig from '@config/express.config';
import { TransactionsModule } from '@modules/transactions/transactions.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ORMConfig = require('../ormconfig');

@Module({
  imports: [
    TypeOrmModule.forRoot(ORMConfig),
    ConfigModule.forRoot({
      load: [expressConfig],
    }),
    TransactionsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
