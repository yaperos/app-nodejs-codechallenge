import { Module } from '@nestjs/common';
import { MsAntiFraudController } from './ms-anti-fraud.controller';
import { MsAntiFraudService } from './ms-anti-fraud.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { KAFKA_CLIENT_CONFIG } from './config/kafka';
import configuration from '../src/config/service.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        ...KAFKA_CLIENT_CONFIG,
      },
    ]),
  ],
  controllers: [MsAntiFraudController],
  providers: [MsAntiFraudService],
})
export class MsAntiFraudModule {}
