import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApiGatewayController } from './controllers/api-gateway.controller';
import { ApiGatewayService } from './services/api-gateway.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        transport: Transport.KAFKA,
        name: 'MOTIONS_SERVICE',
        options: {
          client: {
            clientId: 'transaction',
            brokers: ['localhost:9092']
          },
          consumer: {
            groupId: 'transaction_group'
          }
        }
      }
    ])
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
