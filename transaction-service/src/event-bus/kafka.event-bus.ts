import { Client, ClientKafka } from "@nestjs/microservices";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { kafkaConfig } from "src/kafka.config";

@Injectable()
export class KafkaEventBus {
  @Client(kafkaConfig)
  client: ClientKafka;

  async sendEvent(topic: string, data: any): Promise<void> {
    try {
      await firstValueFrom(this.client.emit(topic, { value: data }));
    } catch (e) {
      console.error(e);
    }
    return;
  }
}
