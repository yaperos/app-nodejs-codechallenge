import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport, ClientKafka } from '@nestjs/microservices';
import { AntiFraudServiceModule } from './anti-fraud-service/anti-fraud-service.module';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'any_name_i_want',
        transport: Transport.KAFKA,
        options: {
          subscribe: {
            fromBeginning: true,
          },
          client: {
            clientId: 'transactions',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'transactions-validate-consumer',
          },
        },
      },
    ]),
    AntiFraudServiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
