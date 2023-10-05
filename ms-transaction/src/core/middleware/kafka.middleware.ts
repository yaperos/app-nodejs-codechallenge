import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaConfigService } from '@src/core/services/kafka-config.services';
import { PrismaService } from '@src/core/services/prisma.services';
import { GROUP_IDS, TOPICS } from '@src/core/constants/kafka.constant';

@Injectable()
export class KafkaMiddleware implements OnModuleInit {
  constructor(
    private kafkaConfigService: KafkaConfigService,
    private prisma: PrismaService,
  ) {}

  private updateTransaction({ id, status }) {
    return this.prisma.transaction.update({
      where: { id },
      data: { status },
    });
  }

  async onModuleInit() {
    const consumer = await this.kafkaConfigService.createConsumer(
      {
        groupId: GROUP_IDS.TRANSACTION_VALIDATION_GROUP,
      },
      { topics: [TOPICS.FRAUD_VALIDATION_RESPONSE], fromBeginning: true },
    );
    await consumer.run({
      eachMessage: async ({ message }) => {
        const transaccion = JSON.parse(message.value.toString());
        await this.updateTransaction({
          id: transaccion.transaction_id,
          status: transaccion.status,
        });
      },
    });
  }
}
