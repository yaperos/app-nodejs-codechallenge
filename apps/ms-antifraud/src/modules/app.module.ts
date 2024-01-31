import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AntiFraudController } from 'src/controllers/antifraud.controller';
import { AntiFraudService } from 'src/services/antifraud.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTIFRAUD-EMITTER',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'ms-antifraud-consumer',
          },
        },
      }
    ])
  ],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AppModule {}
