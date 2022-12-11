import { Module } from '@nestjs/common';
import { AntiFraudService } from './anti-fraud.service';
import { AntiFraudController } from './anti-fraud.controller';
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AntiFraudMapper } from './mapper/anti-fraud.mapper';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AntiFraudController],
  providers: [AntiFraudService, AntiFraudMapper],
  exports: [],
  imports: [    
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: process.env.KAFKA_EMITTER_NAME, 
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER],
          },
          consumer: {
            groupId: process.env.KAFKA_CONSUMER_GROUP,
          },
        },
      },
    ]),
  ]
})
export class AntiFraudModule {}
