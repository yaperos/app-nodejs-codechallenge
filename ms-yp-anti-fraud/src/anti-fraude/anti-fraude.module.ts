import { Module } from '@nestjs/common';
import { AntiFraudeService } from './anti-fraude.service';
import { AntiFraudeController } from './anti-fraude.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AntiFraudeController],
  providers: [AntiFraudeService],
})
export class AntiFraudeModule {}
