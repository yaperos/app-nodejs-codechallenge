import { Module } from '@nestjs/common';
import options from './config/orm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(options as TypeOrmModuleOptions),
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
