import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AntiFraudController } from './application/anti-fraud.controller';
import { AntiFraudService } from './domain/anti-fraud.service';
import { LoggerModule } from './infraestructure/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'YAPE_EVENT_BUS',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud',
            brokers: ['localhost:9092'],
          },
          producerOnlyMode: true,
        },
      },
    ]),
    LoggerModule,
  ],
  controllers: [AntiFraudController],
  providers: [AntiFraudService, LoggerModule],
})
export class AppModule {}
