import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaProducerService } from '../core/kafka/kafka-producer.service';
import {
  CreateExternalTransactionDto,
  CreateInternalTransactionDto,
  EditTransactionDto,
} from './dto';
import {
  Transaction,
  TransactionStatus,
} from '@prisma/client';
import { EmitTransactionDto } from './dto/emit-transaction.dto';
// por razones de brevedad se asume que los tipos de transaccion y sus Ids no cambiaran por lo que los almacenamos en el codigo

@Injectable()
export class TransactionService {
  constructor(
    private prisma: PrismaService,
    private kafkaProducerService: KafkaProducerService,
  ) {}

  getAll(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany();
  }

  async getTransactionById(
    transactionId: string,
  ) {
    const transaction =
      await this.prisma.transaction.findFirst({
        where: {
          transactionId: transactionId,
        },
      });
    const transactionCurrentStatus =
      await this.prisma.transactionStatus.findFirst(
        {
          where: {
            transactionId: transactionId,
            To: null,
          },
        },
      );
    return {
      transaction: transaction,
      status: transactionCurrentStatus,
    };
  }

  async getTransactionsByUser(
    userId: string,
  ): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: {
        OR: [
          {
            debit: {
              user: {
                userId: userId,
              },
            },
          },
          {
            credit: {
              user: {
                userId: userId,
              },
            },
          },
        ],
      },
    });
  }

  async setTransactionStatus(
    transactionId: string,
    newStatusId: string,
  ): Promise<TransactionStatus> {
    const newStatus =
      await this.prisma.statusTransaction.findUnique(
        {
          where: {
            StatusTransactionId: newStatusId,
          },
        },
      );
    if (!newStatus) {
      throw new Error(
        `Status '${newStatusId}' not found`,
      );
    }
    await this.prisma.transactionStatus.deleteMany(
      {
        where: {
          transactionId: transactionId,
        },
      },
    );
    return this.prisma.transactionStatus.create({
      data: {
        transactionId: transactionId,
        statusTransactionId:
          newStatus.StatusTransactionId,
      },
    });
  }

  async createTransaction(
    dto: CreateInternalTransactionDto,
  ) {
    return this.prisma.$transaction(
      // podemos obtener el balance de la cuenta DEBIT para validar que esta tenga fondos
      // pero por razones de testeo y debug de la aplicacion permitimos saldos negativos
      async (tx) => {
        console.log(dto);
        const transaction =
          await tx.transaction.create({
            data: {
              debit: {
                connect: {
                  balanceId: dto.debitAccountId,
                },
              },
              credit: {
                connect: {
                  balanceId: dto.creditAccountId,
                },
              },
              amount: dto.value,
            },
          });

        await tx.transactionStatus.create({
          data: {
            transactionId:
              transaction.transactionId,
            statusTransactionId: 'PENDING',
          },
        });

        const emitDto: EmitTransactionDto = {
          transactionId:
            transaction.transactionId,
          amount: transaction.amount,
        };
        try {
          await this.kafkaProducerService.emit(
            'transaction-created',
            emitDto,
          );
        } catch (error) {
          console.error(
            'Failed to emit transaction:',
            error,
          );
          throw new Error('Kafka emit failed');
        }

        return transaction;
      },
    );
  }

  async createExternalTransaction(
    dto: CreateExternalTransactionDto,
  ) {
    return this.prisma.$transaction(
      // podemos obtener el balance de la cuenta DEBIT para validar que esta tenga fondos
      // pero por razones de testeo y debug de la aplicacion permitimos saldos negativos
      async (tx) => {
        console.log(dto);
        const transaction =
          await tx.transaction.create({
            data: {
              external_account_id_debit:
                dto.accountExternalIdDebit,
              external_account_id_credit:
                dto.accountExternalIdCredit,
              amount: dto.value,
            },
          });

        await tx.transactionStatus.create({
          data: {
            transactionId:
              transaction.transactionId,
            statusTransactionId: 'PENDING',
          },
        });

        const emitDto: EmitTransactionDto = {
          transactionId:
            transaction.transactionId,
          amount: transaction.amount,
        };
        try {
          await this.kafkaProducerService.emit(
            'transaction-created',
            emitDto,
          );
        } catch (error) {
          console.error(
            'Failed to emit transaction:',
            error,
          );
          throw new Error('Kafka emit failed');
        }

        return transaction;
      },
    );
  }

  async editTransactionById(
    dto: EditTransactionDto,
  ) {
    // get the transaction by id
    return this.prisma.transaction.update({
      where: {
        transactionId: dto.transactionId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteTransactionById(
    transactionId: string,
  ) {
    await this.prisma.transaction.update({
      where: {
        transactionId: transactionId,
      },
      data: { deletedAt: new Date() },
    });
  }
}
