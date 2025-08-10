import { faker } from '@faker-js/faker';
import { KafkaContext } from '@nestjs/microservices';
import { Consumer, KafkaMessage } from '@nestjs/microservices/external/kafka.interface';

import { commitOffset } from './commit';

it('commits next offset', async () => {
  const offset = faker.number.int({ min: 0, max: 1000 });
  const partition = faker.number.int({ min: 0, max: 1000 });
  const topic = faker.string.alphanumeric(10);
  const commitOffsets = jest.fn().mockResolvedValue(undefined);
  const ctx = {
    getMessage:   () => ({ offset } as unknown as KafkaMessage),
    getTopic:     () => topic,
    getPartition: () => partition,
    getConsumer:  () => ({ commitOffsets } as unknown as Consumer),
  } as unknown as KafkaContext;

  await commitOffset(ctx);

  expect(commitOffsets).toHaveBeenCalledWith([{
    topic,
    partition,
    offset: (offset + 1).toString(),
  }]);
});