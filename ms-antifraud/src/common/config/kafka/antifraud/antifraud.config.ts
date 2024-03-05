import { Injectable } from "@nestjs/common";
import { ClientsModuleOptionsFactory, KafkaOptions, Transport } from "@nestjs/microservices";
import { EnvironmentService } from "../../environment";

@Injectable()
export class AntifraudKafkaConfigService implements ClientsModuleOptionsFactory {
  constructor(private readonly environmentService: EnvironmentService) { }

  public createClientOptions(): KafkaOptions {
    const { clientId, host, groupId } = this.environmentService.antifraudKafka;
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId,
          brokers: [host],
        },
        consumer: {
          groupId,
        }
      },
    }
  }
}