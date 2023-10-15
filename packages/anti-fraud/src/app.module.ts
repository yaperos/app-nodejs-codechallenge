import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TransactionBusiness } from "./business/transaction.business";
import { StatusEventHandler } from "./handlers/status.handler";
import { ConfigModule, ConfigService } from "@nestjs/config";
import config from "./configuration/envs/config";

@Module({
  controllers: [StatusEventHandler],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ClientsModule.registerAsync([
      {
        name: "TRANSACTION_SERVICE",
        useFactory: async (configService: ConfigService) => {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: "transaction-events-processor",
                brokers: [configService.get("kafka.broker")],
              },
              consumer: {
                allowAutoTopicCreation: true,
                groupId: "transaction-consumer",
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [TransactionBusiness],
})
export class AppModule {}
