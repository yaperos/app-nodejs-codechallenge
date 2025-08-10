import { KafkaContext } from '@nestjs/microservices';

export async function commitOffset(ctx: KafkaContext): Promise<void> {
  try {
    const message = ctx.getMessage();

    await ctx.getConsumer().commitOffsets([{ topic: ctx.getTopic(), partition: ctx.getPartition(), offset: (Number(message.offset) + 1).toString() }]);
  } catch (error) {
    console.error('Error committing message', error);
  }
}