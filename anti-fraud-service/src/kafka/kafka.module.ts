import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { PrismaService } from 'src/database/prisma';

@Module({
  imports: [],
  providers: [ConsumerService, PrismaService],
  exports: [ConsumerService],
})
export class KafkaModule {}
