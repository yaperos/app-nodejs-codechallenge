import { AntifraudController } from "./infrastructure/antifraud.controller";
import { AntifraudService } from "./application/antifraud.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    ConfigModule.forRoot({ expandVariables: true }),
    ClientsModule.registerAsync([
      {
        name: "KAFKA_CLIENT",
        useFactory: () => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [process.env.KAFKA_BROKER],
              retry: {
                factor: 0.2,
                initialRetryTime: 1000,
                maxRetryTime: 3000,
                multiplier: 2,
                retries: 5,
              },
            },
            consumer: {
              groupId: process.env.ANTIFRAUD_GROUP_ID,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [AntifraudController],
  providers: [AntifraudService],
})
export class AntifraudModule {}
