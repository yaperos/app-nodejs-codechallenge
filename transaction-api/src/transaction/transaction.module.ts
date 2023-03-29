import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './controllers/transaction.controller';
import { Transaction } from './entity/transaction.entity';
import { TransactionResolver } from './resolvers/transaction.resolver';
import { TransactionService } from './services/transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),

    ClientsModule.registerAsync([
      {
        name: 'ANTI_FRAUD_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'anti-fraud',
              brokers: [`${configService.get('kafka.host')}:9092`],
            },
            consumer: {
              groupId: 'anti-fraud-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionResolver],
})
export class TransactionModule {}
