import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports: [
    ClientsModule.registerAsync([
      {
        name: "TRANSACTION_SERVICE",
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: config.get('KAFKA_CLIENT_ID'),
              brokers: config.get('KAFKA_BROKERS').split(','),
            }
          }
        }),
        inject: [ConfigService]
      }
    ])
  ]
})
export class TransactionModule { }
