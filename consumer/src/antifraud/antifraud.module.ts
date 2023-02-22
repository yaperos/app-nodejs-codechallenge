import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import {Transaction} from '../common/entities/transaction.entity';
import { getEnvPath } from 'src/common/helper/env.helper';
import { AntifraudController } from './../antifraud/controllers/antifraud.controller';
import { AntifraudService } from './../antifraud/services/antifraud.service';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports:[TypeOrmModule.forFeature([Transaction])],
  controllers: [AntifraudController],
  providers: [AntifraudService],
})
export class AntifraudModule {}
