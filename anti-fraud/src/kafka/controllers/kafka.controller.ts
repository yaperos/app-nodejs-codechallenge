import { Controller } from '@nestjs/common';
import { KafkaService } from '../services/kafka.service';

@Controller()
export class KafkaController {
  constructor(private kafkaService: KafkaService) {}

  async sendMessage(topic: string, message: any): Promise<void> {
    await this.kafkaService.sendMessage(topic, message);
  }
}
