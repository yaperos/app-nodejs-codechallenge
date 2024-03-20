import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { TransactionPayload } from './transaction-payload.dto';
import { AntiFraudStatus } from '.prisma/client/anti-fraud';

@Injectable()
export class AntiFraudService {
  constructor(private prismaService: PrismaService) {}

  async all() {
    return await this.prismaService.antiFraud.findMany();
  }

  async create(messagePayload: TransactionPayload) {
    console.log(
      '<<<< Received transaction service >>>>>',
      messagePayload,
      parseFloat(messagePayload.amount) > 1000,
    );
    return await this.prismaService.antiFraud.create({
      data: {
        transaction_id: messagePayload.id,
        status:
          parseFloat(messagePayload.amount) > 1000
            ? AntiFraudStatus.REJECTED
            : AntiFraudStatus.APPROVED,
      },
    });
  }
}
