import {Module} from '@nestjs/common';
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
      ClientsModule.register([{
        name: 'ANTI_FRAUD',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti_fraud',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'anti_fraud_consumer',
          },
        },
      }]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
