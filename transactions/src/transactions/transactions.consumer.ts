import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionConsumer implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      {
        topics: [
          'transaction-approved',
          'transaction-rejected',
          'transaction-created',
        ],
      },
      {
        eachMessage: async ({ topic, message }) => {
          const { value } = message;

          console.log(topic, value.toString());

          if (topic === 'transaction-approved') {
            this.prisma.transaction.update({
              data: {
                transactionStatusId: 2,
              },
              where: { id: value.toString() },
            });
          }

          if (topic === 'transaction-rejected') {
            this.prisma.transaction.update({
              data: {
                transactionStatusId: 3,
              },
              where: { id: value.toString() },
            });
          }
        },
      },
    );
  }
}
