import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ValidateFinancialTransactionService } from './validate-financial-transaction/application/validate-financial-transaction.service';
import { ValidateFinancialTransactionController } from './validate-financial-transaction/infrastructure/validate-financial-transaction.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'FINANCIAL_TRANSACTION_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'antifraud-client',
              brokers: [
                configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
              ],
              ssl: true,
              sasl: {
                mechanism: 'plain',
                username: configService.get<string>('KAFKA_USERNAME') || '',
                password: configService.get<string>('KAFKA_PASSWORD') || '',
              },
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ValidateFinancialTransactionController],
  providers: [ValidateFinancialTransactionService],
})
export class AntifraudModule {}
