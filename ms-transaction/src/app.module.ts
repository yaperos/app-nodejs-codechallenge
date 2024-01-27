import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InfraestructureModule } from './infraestructure/infraestructure.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from './infraestructure/db/postgres';
import { TransactionUseCase } from './application/transaction';
import { PostgresRepository } from './infraestructure/repository/postgre.repository';
import { TransactionModel } from './infraestructure/model/transaction.model';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([TransactionModel]),
    InfraestructureModule,
  ],
  providers: [TransactionUseCase, PostgresRepository],
})
export class AppModule {}
