import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './controllers/transactions.controller';
import { TransactionService } from './services/transaction.service';
import { TransaccionEntity } from './entities';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionService],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([TransaccionEntity]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      retryDelay: 3000,
      retryAttempts: 10,
    }),
  ],
})
export class TransactionsModule {}
