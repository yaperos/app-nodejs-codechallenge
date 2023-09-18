import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Database } from '../start/database';
import config from '../start/config';
// Controllers
import { AppController } from './app.controller';
import { TransactionController } from './transactions/controllers/transaction.controller';
import { DataupdateController } from './transactions/controllers/dataupdate.controller';
// Modules
import { TransactionModule } from './transactions/modules/transaction.module';
// Services
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [config],
    }),
    Database,
    TransactionModule,
  ],
  controllers: [AppController, TransactionController, DataupdateController],
  providers: [AppService, TransactionModule],
})
export class AppModule {}
