import { Module } from '@nestjs/common';
import { YapeAntiFraudController } from './yape-anti-fraud.controller';
import { YapeAntiFraudService } from './yape-anti-fraud.service';
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'YAPE_TX_MICROSERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 8082
        }
      },
    ]),
  ],
  controllers: [YapeAntiFraudController],
  providers: [YapeAntiFraudService],
})
export class YapeAntiFraudModule {}
