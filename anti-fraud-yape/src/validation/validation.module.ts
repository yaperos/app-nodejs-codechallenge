import { Module } from '@nestjs/common';
import { ValidationController } from './controller/validation.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [ValidationController],
  imports:[
    ClientsModule.register([
      {
        name: 'ANTIFRAUD_SERVICE',
        transport: Transport.KAFKA,
        options:{
          client:{
            clientId: 'antifraude',
            brokers: ['kafka-yape:29092']
          }
        }
      }
    ])
  ]
})
export class ValidationModule {}
