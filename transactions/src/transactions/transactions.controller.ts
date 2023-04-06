import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';

interface TransactionModeratedEvent {
  id: string;
  status: 'approved' | 'rejected';
}

@Controller()
export class TransactionController {
  constructor(private readonly prisma: PrismaService) {}

  @EventPattern('transaction_moderated')
  public async transactionModerated(data: TransactionModeratedEvent) {
    const { id, status } = data;

    let statusId = 1;

    if (status === 'approved') statusId = 2;
    if (status === 'rejected') statusId = 3;

    try {
      await this.prisma.transaction.update({
        where: { id },
        data: {
          transactionStatus: {
            connect: {
              id: statusId,
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
}
