import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TransactionController } from './ms-transactions.controller'
import { TransactionService } from './ms-transactions.service'
import { DatabaseModule } from "@app/common"
import { TransactionRepository } from "./ms-transactions.repository"
import { TransactionDocument, TransactionSchema } from "./ms-transactions.schema"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'transaction-service',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get('KAFKA_TRANSACTION_CLIENT_ID'),
              brokers: [configService.get('KAFKA_BROKER_URL')],
            },
            consumer: {
              groupId: configService.get('KAFKA_ANTI_FRAUD_CONSUMER_ID'),
            },
          },
        }),
        inject: [ConfigService],
      }
    ]),
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: TransactionDocument.name, schema: TransactionSchema }
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
})
export class TransactionModule {}
