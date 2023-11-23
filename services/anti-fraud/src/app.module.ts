import { Module } from '@nestjs/common';
import { ConsumerModule } from './consumer/consumer.module';

@Module({
  imports: [ConsumerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
