import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AntiService } from './anti.service';
import { AntiController } from './anti.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTIFRAUDE_MS',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'antifraude_group',
          },
        },
      },
    ]),
  ],
  providers: [AntiService],
  controllers: [AntiController],
})
export class AntiModule {}
