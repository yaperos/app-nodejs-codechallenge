import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { BalanceService } from './service/balance.service';
import { BalancesController } from './controller/balances.controller';
import { balanceModel, balanceSchema } from './schema/balance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: balanceModel.name, schema: balanceSchema },
    ]),
    ClientsModule.register([
      {
        name: 'BALANCE_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'balance-service',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'balance-service-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [BalancesController],
  providers: [BalanceService],
  exports: [BalanceService],
})
export class BalancesModule {}
