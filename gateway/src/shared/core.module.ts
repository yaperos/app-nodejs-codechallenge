import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaProvider } from './infrastructure/providers/kafka.provider';

@Global()
@Module({
  imports: [
    KafkaProvider,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  exports: [KafkaProvider],
})
export class CoreModule {}
