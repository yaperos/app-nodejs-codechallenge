import { Injectable, Logger } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { TransactionOutboxStatusEnum } from "@shared/contracts";
import { PrismaService } from "@shared/db";
import { KafkaProducer } from "@shared/messaging/messaging-kafka";

@Injectable()
export class OutboxDrainer {
  private readonly logger: Logger
  private readonly batch = 100;

  constructor(private readonly prisma: PrismaService, private readonly producer: KafkaProducer) {
    this.logger = new Logger(OutboxDrainer.name);
  }

  @Interval(250)
  async drain() {
    const pendingItems = await this.prisma.$queryRaw<{
      id: string; 
      topic: string; 
      key: string; 
      status: string;
      available_at: Date;
    }[]>`
      SELECT id, topic, key, status, available_at
      FROM outbox
      WHERE status = 'PENDING' AND available_at <= (now() AT TIME ZONE 'UTC')
      FOR UPDATE SKIP LOCKED
      LIMIT ${this.batch}
    `;

    const claimed = await this.prisma.outbox.updateManyAndReturn({
      where: { id: { in: pendingItems.map(item => item.id) } },
      data: { status: TransactionOutboxStatusEnum.SENDING },
    });

    for (const claim of claimed) {
      try {
        await this.producer.publish(claim.topic, claim.key, claim.payload);
        await this.prisma.outbox.delete({ where: { id: claim.id } });
      } catch (err) {
        this.logger.warn(`publish failed for outbox id=${claim.id}: ${String(err)}`);

        await this.prisma.outbox.update({
          where: { id: claim.id },
          data: {
            status: TransactionOutboxStatusEnum.PENDING,
            attempts: { increment: 1 },
            availableAt: new Date(Date.now() + 30000),
          }
        });
      }
    }
  }  
}