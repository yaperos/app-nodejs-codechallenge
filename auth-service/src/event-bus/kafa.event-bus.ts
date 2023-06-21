import {Injectable} from "@nestjs/common";
import {Client, ClientKafka} from "@nestjs/microservices";
import {kafkaConfig} from "../shared/options";

@Injectable()
export class EventBusKafka {
  @Client(kafkaConfig)
  client: ClientKafka;

  async onModuleInit() {
    const KafkaRequest = [];
    KafkaRequest.forEach((request) => {
      this.client.subscribeToResponseOf(request);
    })
  }
}