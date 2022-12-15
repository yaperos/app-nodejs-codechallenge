import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionRestController } from '../adapter/input/web/transaction.rest.controller';
import { TransactionEntity } from '../domain/models/transaction.entity';
import { TransactionCreationUsecase } from '../domain/usecases/transaction_creation.usecase';
import { TransactionService } from '../adapter/out/db/transaction.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([TransactionEntity]),
  ],
  controllers: [
    TransactionRestController
  ],
  providers: [
      TransactionCreationUsecase,
      TransactionService
  ],
})
export class AppModule {}
