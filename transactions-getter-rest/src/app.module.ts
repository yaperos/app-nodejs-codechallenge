import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import options from './config/orm';

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
