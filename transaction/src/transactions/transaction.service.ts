import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Status, Transaction } from '@prisma/client';
import {
  NewTransaction,
  Response,
  TransactionDB,
} from 'src/graphql';
import { SendTransactionDto, ReceiveTransactionDto } from 'src/transactions/dto/sendTransaction.dto'
import { ClientKafka } from '@nestjs/microservices';
import { TransactionValidatedEvent } from './trasactionValidated.event';
import { lastValueFrom, Observable } from 'rxjs';
import { UpdateTransactionI } from './interfaces/status.interface';

@Injectable()
export class TransactionService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    @Inject('ANTI-FRAUD') private readonly antiFraud: ClientKafka,
  ) {}
  private transactionTypes = ['Provicia', 'Nacional', 'Internacional'];
  async onModuleInit() {
    await this.antiFraud.subscribeToResponseOf('antiFraud');
  }

  sendTransaction(data: any): Observable<ReceiveTransactionDto> {
    return this.antiFraud.send<ReceiveTransactionDto>(
      'antiFraud',
      new TransactionValidatedEvent(
        data.id,
        data.accountExternalIdDebit,
        data.accountExternalIdCredit,
        data.tranferTypeId,
        data.value,
        data.statusArray,
        data.createdAt,
      ).toString(),
    );
  }

  // Get a single transaction
  async transaction(id: string): Promise<TransactionDB> {
    return ({
      ...(await this.prisma.transaction.findUnique({
        where: {
          id: parseInt(id),
        },
      })),
      statusArray: await this.prisma.status.findMany({
        where: {
          transactionId: parseInt(id),
        }
      })
    })
  }

  // Get multiple transactions
  async transactions(): Promise<TransactionDB[]> {
    const tables: TransactionDB[] = await this.prisma.transaction.findMany({})
    const allStatus: Status[] = await this.prisma.status.findMany({})
    let res: TransactionDB[] = []
    tables.forEach(table => {
      table.statusArray = allStatus.filter((status) => (table.id == status.transactionId))
      res.push(table)
      })
    return res
  }

  private insertStatus(input: NewTransaction): any {
    let transaction : SendTransactionDto = {...input}
    return transaction
  }

  // Create a transaction
  async createTransaction(input: NewTransaction): Promise<Response> {
    const dataDB: TransactionDB = await this.prisma.transaction.create({
      data: {
        ...this.insertStatus(input),
        statusArray: {
          create: {}
        }
      }
    });
    const response: ReceiveTransactionDto = await lastValueFrom(
      this.sendTransaction(dataDB),
      );
    const statusDB = await this.updateTransaction({
      id: dataDB.id,
      statusArray: response.eventStatus.statusArray.status,
    });
    const transactionReturned: Response = {
      transactionExternalId: dataDB.id,
      transactionType: {
        name: this.transactionTypes[input.tranferTypeId],
      },
      transactionStatus: {
        name: response.eventStatus.statusArray.status,
      },
      value: input.value,
      createdAt: dataDB.createdAt,
    };
    return transactionReturned;
  }

  // Update a transaction
  async updateTransaction(params: UpdateTransactionI): Promise<TransactionDB> {
    const { id, statusArray } = params;
    return await this.prisma.transaction.update({
      where: {
        id: id,
      },
      data: {
        statusArray: {
          create: {
            status: statusArray,
          }
        }
       },
    });
  }

  // delete a transaction
  async deleteTransaction(id: string): Promise<TransactionDB> {
    return this.prisma.transaction.delete({
      where: {
        id: parseInt(id),
      },
    });
  }
}
