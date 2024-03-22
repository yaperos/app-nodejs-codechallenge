import {Module} from "@nestjs/common";
import { AntiFraudController } from "../anti-fraud/infra/controllers/antri-fraud.controller";
import { AntiFraudService } from "../anti-fraud/app/anti-fraud.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Partitioners } from "kafkajs";

@Module({
    controllers: [AntiFraudController],
    providers: [AntiFraudService],
    imports:[
        ClientsModule.register([
            {
              name: 'TRANSACTION_SERVICE',
              transport: Transport.KAFKA,
              
              options: {
                client: {
                  brokers: ['localhost:9092'],
                },
                producer: {
                    createPartitioner: Partitioners.LegacyPartitioner,
                  },
              },
            },
          ]),
    ],
    exports:[AntiFraudService]
  })

export class AntiFraudModule {}