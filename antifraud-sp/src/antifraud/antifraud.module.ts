import { Module } from '@nestjs/common';
import { AppController } from './antifraud.controller';
import { AppService } from './antifraude.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTIFRAUD_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'antifraud',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'antifraud-consumer',
          },
          run: {
            autoCommit: false,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
