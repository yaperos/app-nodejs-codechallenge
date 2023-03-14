import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { SecurityService } from './application/security.service';
import { SecurityKey } from './domain/ports';
import { SecurityController } from './infrastructure/controllers/security.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: SecurityKey.KAFKA_CLIENT,
        transport: Transport.KAFKA,
        options: {
          consumer: {
            groupId: 'transaction-consumer',
          },
          client: {
            brokers: ['localhost:9092'],
            clientId: 'transaction-2',
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
    ]),
  ],
  controllers: [SecurityController],
  providers: [SecurityService],
})
export class SecurityModule {}
