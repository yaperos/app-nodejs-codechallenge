import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import TransactionController from "./transactions.controller";
import TransactionService from "./transactions.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import TransactionsEntity from "./transactions.entity";
import TransactionRepository from "./transactions.repository";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionsEntity]),
        ClientsModule.registerAsync([{
            imports:[ConfigModule],
            inject:[ConfigService],
            name: 'ANTI-FRAUD-VALIDATED',
            useFactory: (configService:ConfigService) => {
              return {
                transport:Transport.KAFKA,
                options: {
                  client: {
                    clientId: 'ANTI-FRAUD-VALIDATED',
                    brokers: [`${configService.get("server.dns")}:${configService.get("kafka.port")}`]
                  },
                  consumer: {
                    groupId: 'anti-fraud-validated'
                  }
                }
              }
            }
          }])
    ],
    controllers: [TransactionController],
    providers: [TransactionService,TransactionRepository]
})
export default class TransactionModule {}