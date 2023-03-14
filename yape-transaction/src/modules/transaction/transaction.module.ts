import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@nestjs/microservices';
import { AntifraudKafkaConfig } from '@core/config/kafka';
import { RedisCacheModule } from '@core/cache';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction, TransactionType } from './entities';


@Module({
  imports: [
    RedisCacheModule,
    TypeOrmModule.forFeature([Transaction, TransactionType]),
    ClientsModule.register([AntifraudKafkaConfig()]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
