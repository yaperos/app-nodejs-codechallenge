import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionStatus, TransactionType } from '../transaction';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionStatus, TransactionType])],
  providers: [SeedService],
})
export class SeedModule {}
