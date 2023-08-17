import { Inject } from '@nestjs/common';
import { ClientKafka, KafkaContext } from '@nestjs/microservices';

export class Consumer {
  constructor(@Inject('MY_CLIENT_KAFKA') readonly client: ClientKafka) {}

  async commitOffset(context: KafkaContext) {
    const { offset } = context.getMessage();
    const partition = context.getPartition();
    const topic = context.getTopic();
    await this.client.commitOffsets([{ topic, partition, offset }]);
  }
}
