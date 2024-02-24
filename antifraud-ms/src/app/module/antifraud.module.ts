import { Logger, Module } from '@nestjs/common';
import { AntiFraudListener } from '../../core/listener/antiFraud.listener';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AntifraudService } from 'src/core/service/antifraud.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRANSACTION-BCP',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_SERVER],
          },
          consumer: {
            groupId: 'bcp-group',
          },
        },
      },
    ]
    )
 ],
  controllers: [AntiFraudListener],
  providers: [AntifraudService, Logger]
})
export class AntiFraudModule {}
