import { Module } from '@nestjs/common';
import { AntiFraudReceiverService } from './anti-fraud-receiver.service';
import { AntiFraudReceiverController } from './anti-fraud-receiver.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports : [
    PrismaModule,
    RedisModule
  ],
  controllers: [AntiFraudReceiverController],
  providers: [AntiFraudReceiverService]
})
export class AntiFraudReceiverModule {}
