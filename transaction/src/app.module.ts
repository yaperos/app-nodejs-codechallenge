import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";



@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: ["dev.env"]
  }),TransactionModule,DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule]
})
export class AppModule {}
