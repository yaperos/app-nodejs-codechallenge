import { Module } from '@nestjs/common';
import { PassengerController } from './passenger.controller';
import { ProxyModule } from './../common/proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [PassengerController],
})
export class PassengerModule {}
