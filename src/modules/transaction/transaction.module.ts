import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionRepository } from './repository/transaction.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { serverConfigLoader } from '../config/loaders';
import { ServerConfigType } from '../config/types/server.type';
import { AntiFraudModule } from '../anti-fraud/anti-fraud.module';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity]), AntiFraudModule],
  providers: [TransactionService, TransactionRepository],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
