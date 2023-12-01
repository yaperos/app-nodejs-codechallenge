import { Injectable } from '@nestjs/common';
import { Prisma, transaction as TransactionPrisma, TransactionStatus } from '@prisma/client';
import { TransactionSqlModel } from './model';
import { TransactionRepository } from 'src/core/transaction/repository';
import { Transaction, CreateTransactionQuery, SearchTransactionQuery } from 'src/core/transaction/query';
import { filterPagination } from '../common_filter';
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

  static toDomain(txn: TransactionModel): Transaction {
    return Transaction.of({
      id: txn.id,
      accountExternalIdDebit: txn.account_external_id_debit,
      accountExternalIdCredit: txn.account_external_id_credit,
      tranferTypeId: txn.tranfer_type_id,
      status: txn.status,
      value: txn.value,
      isDeleted: txn.is_deleted,
      createdAt: Math.floor(txn.created_at.getTime() / 1000),
      updatedAt: Math.floor(txn.updated_at.getTime() / 1000),
    })
  }
}

@Injectable()
export class TransactionSqlRepository implements TransactionRepository {
  constructor(private prisma: TransactionSqlModel) { }

  async getById(id: number): Promise<Transaction | null> {
    const transaction: TransactionModel = await this.prisma.transaction.findUnique({ where: { id }, });
    return transaction && TransactionModel.toDomain(transaction);
  }

  async create(data: CreateTransactionQuery): Promise<Transaction> {
    try {
      const transaction: TransactionModel = await this.prisma.transaction.create({
        data: {
          account_external_id_debit: data.account_external_id_debit,
          account_external_id_credit: data.account_external_id_credit,
          tranfer_type_id: data.tranfer_type_id,
          value: data.value
        }
      })

      return TransactionModel.toDomain(transaction);
    } catch (err: any) {
      //console.log(err.message)
      throw new SqlServerError("database error")
    }
  }

  async search(query: SearchTransactionQuery): Promise<Transaction[]> {
    try {
      console.log("query",query)
      const pagination = filterPagination(query.page, query.limit)
      let where: Prisma.transactionWhereInput = { is_deleted: false }

      if (query.ids && query.ids.length > 0) {
        where.id = { in: query.ids }
      }

      if (query.status && query.status.length > 0) {
        where.status = { in: query.status }
      }
      console.log("where",where)
      const transactions = await this.prisma.transaction.findMany({
        where, skip: pagination.offset,
        take: pagination.limit,
      })

      return transactions.map(t => TransactionModel.toDomain(t))
    } catch (err: any) {
      //console.log(err.message)
      throw new SqlServerError("database error")
    }
  }

  async count(query: SearchTransactionQuery): Promise<number> {
    try {
      const pagination = filterPagination(query.page, query.limit)
      let where: Prisma.transactionWhereInput = { is_deleted: false }

      if (query.ids && query.ids.length > 0) {
        where.id = { in: query.ids }
      }

      if (query.status && query.status.length > 0) {
        where.status = { in: query.status }
      }

      const count = await this.prisma.transaction.count({ where })
      return count
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

  async delete(id: number): Promise<Transaction> {
    try {
      const transaction: TransactionModel = await this.prisma.transaction.update({
        where: { id },
        data: { is_deleted: true }
      });

      return TransactionModel.toDomain(transaction);
    } catch (err: any) {
      //console.log(err.message)
      throw new SqlServerError("database error")
    }
  }
}