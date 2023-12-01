import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/persistence/PrismaService';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
