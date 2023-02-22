import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import {Transaction} from '../common/entities/transaction.entity';
import { getEnvPath } from './../common/helper/env.helper';
import { TransactionController } from './../transaction/controllers/transaction.controller';
import { TransactionService } from './../transaction/services/transaction.service';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports:[TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
