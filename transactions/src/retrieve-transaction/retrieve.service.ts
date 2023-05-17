import { Injectable } from '@nestjs/common';
import { Transaction } from 'kafkajs';
import { PrismaService } from 'src/prisma/prisma.service';
import { ITransaction } from 'src/transaction/dto/create-anti-fraud-service.dto';

@Injectable()
export class RetriveService {
  constructor(private prisma: PrismaService) {}
  async updateTransition(transaction: ITransaction) {
    console.log("transactionId", transaction.transactionExternalId)
    const updateUser = await this.prisma.transaction.update({
      where: {
        transactionExternalId:transaction.transactionExternalId,
      },
      data: {
        transactionStatus: transaction.transactionStatus,
      },
    });
    return updateUser;
  }
}
