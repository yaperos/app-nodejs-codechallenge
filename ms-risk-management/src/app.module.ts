import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FraudAssessmentUseCase } from './application/usecase/fraud/FraudAssessment.usecase';
import { PaymentConsumer } from './infrastruture/service/tcp/paymentConsumer.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'payment-management-consumer-group',
          },
        },
      },
    ]),
  ],
  controllers: [
    PaymentConsumer,
  ],
  providers: [
    FraudAssessmentUseCase,
  ],
})
export class AppModule { }
