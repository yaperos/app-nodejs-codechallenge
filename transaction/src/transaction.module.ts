import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TransactionController } from './transaction.controller';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';
import { Transaction } from './table/transaction.entity';
import { TransactionRepository } from './repository/transaction.repository';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTI-FRAUD_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'grp_antiFraud',
          },
        },
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      entities: [Transaction],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
  exports: [TypeOrmModule],
})
export class TransactionModule {
  constructor(private dataSource: DataSource) {}
}
