import { Module } from '@nestjs/common';
import { MicroservicesClientService } from './services/microservices-client.service';

@Module({
  providers: [MicroservicesClientService],
  exports: [MicroservicesClientService],
})
export class MicroservicesClientModule {}
