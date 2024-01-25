import { Module } from '@nestjs/common';
import { TransactionController } from './controller/transaction.controller';
import { PostgresRepository } from './repository/postgre.repository';
import { TransactionUseCase } from 'src/application/transaction';
import { TransactionModel } from './model/transaction.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaModule } from './message/kafka/kafka.module';

@Module({
    imports:[TypeOrmModule.forFeature([TransactionModel]), KafkaModule],
    providers: [TransactionUseCase, PostgresRepository],
    controllers:[TransactionController]
})
export class InfraestructureModule {}
