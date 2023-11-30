import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Transaction } from './transaction/entities/transaction.entity';
import { TransactionStatus, TransferType } from './transaction/entities/catalogs.entity';
import { Initial1701197847685 } from './config/orm/migrations/1701197847685-initial';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [
        Transaction,
        TransferType,
        TransactionStatus
      ],
      synchronize: false,
      migrations: [
        Initial1701197847685
      ],
      migrationsRun: true
    }),
    TransactionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
