import { Module } from '@nestjs/common';
import { MicroAntiFraudController } from './anti-fraud.controller';
import { MicroAntiFraudService } from './anti-fraud.service';
import { KafkaModule } from './kafka/kafka.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
console.log(process.cwd());
console.log(join(process.cwd(), 'apps/micro-anti-fraud/.environment'));
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.environment`]
    }),
    KafkaModule],
  controllers: [MicroAntiFraudController],
  providers: [MicroAntiFraudService],
})
export class MicroAntiFraudModule {}
