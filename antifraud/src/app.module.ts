import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTIFRAUD_RESPONSE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092']
          },
          consumer: {
            groupId: 'antifraud-consumer'
          }
        }
      }
    ])

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
