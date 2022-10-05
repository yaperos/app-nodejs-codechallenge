import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './common/database/orm.config';
import { TransactionModule } from './module/transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    TransactionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
