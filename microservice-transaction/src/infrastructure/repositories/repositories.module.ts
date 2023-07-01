import { Module } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';
import { PrismaModule } from '../config/prisma/prisma.module';
import { KafkaModule } from '../kafka/kafka.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [PrismaModule, KafkaModule, LoggerModule],
  providers: [RepositoriesService],
  exports: [RepositoriesService],
})
export class RepositoriesModule {}
