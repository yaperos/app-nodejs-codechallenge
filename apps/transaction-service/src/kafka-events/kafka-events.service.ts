import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import { BaseKafkaService } from '../common/base-kafka.service';

@Injectable()
export class KafkaEventsService extends BaseKafkaService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('KAFKA_SERVICE') kafkaClient: ClientKafka,
  ) {
    super(kafkaClient);
  }

  async handleTransactionApproved(data: {
    transactionId: string;
    statusCode: string;
  }) {
    console.log('Transaction approved event received:', data);
    return this.updateTransactionStatus(data.transactionId, 'approved');
  }

  async handleTransactionRejected(data: {
    transactionId: string;
    statusCode: string;
  }) {
    console.log('Transaction rejected event received:', data);
    return this.updateTransactionStatus(data.transactionId, 'rejected');
  }

  private async updateTransactionStatus(
    transactionId: string,
    statusCode: string,
  ) {
    return this.prisma.transaction.update({
      where: { externalId: transactionId },
      data: { statusCode },
      include: {
        transactionType: true,
        status: true,
      },
    });
  }
}
