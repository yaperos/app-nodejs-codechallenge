import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ConsumerController } from './consumer.controller';
import { ConsumerService } from './consumer.service';

@Module({
  imports: [PrismaModule],
  controllers: [ConsumerController],
  providers: [ConsumerService],
})
export class ConsumerModule {}