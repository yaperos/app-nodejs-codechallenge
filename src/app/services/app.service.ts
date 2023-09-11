import { Inject, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '..//DTOs/createTransaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionStatus } from '../../util/enum/transaction-status.enum'
import { EventBus } from '../interface/event.bus';
import { TransactionDtotoEntity } from '../interface/transactionDtotoEntity.interface';
import { ResponseLastTransaction } from '../interface/responseLastTransaction.interface';
import { KAFKA_TOPIC } from '../../util/enum/kafka.enum'
import { v4 as uuidv4 } from 'uuid';
import { RequestTransactionDto } from '..//DTOs/requestTransaction.dto';
import { CachingService } from '../interface/caching.service.interface';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('EventBus') private readonly eventBus: EventBus,
    @Inject('CachingService') private readonly cachingService: CachingService,
    private prisma: PrismaService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  public async create(transaction: CreateTransactionDto) {
    const transactionWithStatus: TransactionDtotoEntity = {
      ...transaction,
      status: TransactionStatus.PENDING,
      transactionExternalId: uuidv4()
    }
    const transactionRow = await this.prisma.transaction.create({ data:  transactionWithStatus});
    await this.eventBus.publish({
      event_name: KAFKA_TOPIC.VALIDATE_ANTIFRAUD,
      key: transactionRow.id.toString(),
      partition: 1,
      timestamp: transactionRow.createdAt.toString(),
      message: transactionRow
    });

    return {
      status: true,
      message:"The transaction has been saved successfully"
    }
  }

  public async getLastTransaction(transaction: RequestTransactionDto) {
    let transactionRow = await lastValueFrom(
      this.cachingService.getTransactionDetail$(transaction.transactionExternalId)
    );

    if(!transactionRow){
      console.log("base de datos")
      transactionRow = await this.prisma.transaction.findUnique({
        where: {
          transactionExternalId: transaction.transactionExternalId
        },
        include: { transferType: true },
      });

      this.cachingService.setTransactionDetail$(transactionRow)
    }

    const lastTransaction: ResponseLastTransaction = {
      transactionExternalId:  transactionRow.transactionExternalId,
      transactionType: {
        name: transactionRow.transferType.name
      },
      transactionStatus: {
        name: transactionRow.status
      },
      value: transactionRow.value,
      createdAt: transactionRow.createdAt,
    }

    return {
      status: true,
      message:"Request success",
      data: lastTransaction
    }
  }
}
