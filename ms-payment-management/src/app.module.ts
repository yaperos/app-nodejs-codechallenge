import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavePaymentController } from './infrastructure/presentation/operation/http/v1/savePayment.controller';
import { SavePaymentUseCase } from './application/usecase/operation/savePayment.usecase';
import { UserSeeder } from './application/seed/userSeeder.seed';
import { User, Payment } from './domain/entities';
import { UpdatePaymentUseCase } from './application/usecase/operation/updatePayment.usecase';
import { FraudPaymentStatusConsumer } from './infrastructure/service/tcp/fraudPaymentStatusConsumer.service';
import { TransferTypeSeeder } from './application/seed/transferTypeSeeder.seed';
import { TransferType } from './domain/entities/transferType.entity';
import { TransactionStatus } from './domain/entities/transactionStatus.entity';
import { GetPaymentController } from './infrastructure/presentation/operation/http/v1/getPayment.controller';
import { GetPaymentUseCase } from './application/usecase/operation/getPayment.usecase';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'payments_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Payment, TransferType, TransactionStatus]),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'risk-management-consumer-group',
          },
        },
      },
    ]),
  ],
  controllers: [
    GetPaymentController,
    SavePaymentController,
    FraudPaymentStatusConsumer,
  ],
  providers: [
    UserSeeder,
    TransferTypeSeeder,
    GetPaymentUseCase,
    SavePaymentUseCase,
    UpdatePaymentUseCase,
  ],
})
export class AppModule { }
