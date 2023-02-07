import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApiGatewayController } from './api-transaction.controller';
import { ApiGatewayService } from './api-transaction.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        transport: Transport.KAFKA,
        name: 'MOTIONS_SERVICE',
        options: {
          client: {
            clientId: 'transaction',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: `grp_transaction`,
          },
        },
      },
    ]),
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
