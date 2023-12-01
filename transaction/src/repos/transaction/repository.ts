import { Injectable } from '@nestjs/common';
import { transaction as TransactionPrisma, TransactionStatus } from '@prisma/client';
import { Transaction } from 'src/core/transaction/query';
import { TransactionSqlModel } from './model';
import { TransactionRepository } from 'src/core/transaction/repository';
import { SqlServerError } from 'src/core/errors';

class TransactionModel implements TransactionPrisma {
  id: number;
  account_external_id_debit: string
  account_external_id_credit: string
  tranfer_type_id: number
  status: TransactionStatus;
  value: number;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;

  static toDomain(blog: TransactionModel): Transaction {
    return Transaction.of({
      id: blog.id,
      accountExternalIdDebit: blog.account_external_id_debit,
      accountExternalIdCredit: blog.account_external_id_credit,
      tranferTypeId: blog.tranfer_type_id,
      status: blog.status,
      value: blog.value,
      isDeleted: blog.is_deleted,
      createdAt: Math.floor(blog.created_at.getTime() / 1000),
      updatedAt: Math.floor(blog.updated_at.getTime() / 1000),
    })
  }
}


@Injectable()
export class TransactionSqlRepository implements TransactionRepository {
  constructor(private prisma: TransactionSqlModel) { }

  async getById(id: number): Promise<Transaction> {
    try {
      const transaction: TransactionModel = await this.prisma.transaction.findUnique({ where: { id }, });

    return TransactionModel.toDomain(transaction);
  } catch (err: any) {
    //console.log(err.message)
    throw new SqlServerError("database error")
  }
  }

  async update(id: number, status: TransactionStatus): Promise<Transaction> {
    try {
      const transaction: TransactionModel = await this.prisma.transaction.update({
        where: { id },
        data: { status }
      });
  
      return TransactionModel.toDomain(transaction);
    } catch (err: any) {
      //console.log(err.message)
      throw new SqlServerError("database error")
    }
  }
}