import { Module } from '@nestjs/common';
import { AntiFraudReceiverService } from './anti-fraud-receiver.service';
import { AntiFraudReceiverController } from './anti-fraud-receiver.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports : [
    PrismaModule
  ],
  controllers: [AntiFraudReceiverController],
  providers: [AntiFraudReceiverService]
})
export class AntiFraudReceiverModule {}
