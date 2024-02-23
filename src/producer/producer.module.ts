import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProducerController],
  providers: [ProducerService],
})
export class ProducerModule {}
