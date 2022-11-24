import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTI-FRAUD',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'antiFraud',
            brokers: [process.env.KAFKA_URL],
          },
          consumer: {
            groupId: 'antiFraud-consumer',
          }
        }
      }
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
