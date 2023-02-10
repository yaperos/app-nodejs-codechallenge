import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller()
export class TransactionController {
  constructor(private readonly prisma: PrismaService) {}

  @EventPattern('transaction_moderated')
  public transactionModerated(data: any) {
    console.log(data);
    // if (topic === 'transaction-approved') {
    //   this.prisma.transaction.update({
    //     data: {
    //       transactionStatusId: 2,
    //     },
    //     where: { id: value.toString() },
    //   });
    // }

    // if (topic === 'transaction-rejected') {
    //   this.prisma.transaction.update({
    //     data: {
    //       transactionStatusId: 3,
    //     },
    //     where: { id: value.toString() },
    //   });
    // }
  }
}
