import { Injectable } from '@nestjs/common';
import { Prisma, tranfer_type as TransferPrisma } from '@prisma/client';
import { TransferSqlModel } from './model';
import { TransferRepository } from 'src/core/transfer/repository';
import { Transfer, CreateTransferQuery, SearchTransferQuery } from 'src/core/transfer/query';
import { filterPagination } from '../common_filter';
import { SqlServerError } from 'src/core/errors';

class TransferModel implements TransferPrisma {
  id: number;
  name: string
  is_deleted: boolean;

  static toDomain(transfer: TransferModel): Transfer {
    return Transfer.of({
      id: transfer.id,
      name: transfer.name,
      isDeleted: transfer.is_deleted
    })
  }
}

@Injectable()
export class TransferSqlRepository implements TransferRepository {
  constructor(private prisma: TransferSqlModel) { }

  async create(data: CreateTransferQuery): Promise<Transfer> {
    try {
      const transfer: TransferModel = await this.prisma.tranfer_type.create({
        data: {
          name: data.name
        }
      })

      return TransferModel.toDomain(transfer);
    } catch (err: any) {
      //console.log(err.message)
      throw new SqlServerError("database error")
    }
  }

  async search(query: SearchTransferQuery): Promise<Transfer[]> {
    try {
      const pagination = filterPagination(query.page, query.limit)
      let where: Prisma.tranfer_typeWhereInput = { is_deleted: false }

      if (query.ids && query.ids.length > 0) {
        where.id = { in: query.ids }
      }

      if (query.names && query.names.length > 0) {
        where.name = { in: query.names }
      }

      const transfers = await this.prisma.tranfer_type.findMany({
        where, skip: pagination.offset,
        take: pagination.limit,
      })

      return transfers.map(t => TransferModel.toDomain(t))
    } catch (err: any) {
      //console.log(err.message)
      throw new SqlServerError("database error")
    }
  }

  async count(query: SearchTransferQuery): Promise<number> {
    try {
      const pagination = filterPagination(query.page, query.limit)
      let where: Prisma.tranfer_typeWhereInput = { is_deleted: false }

      if (query.ids && query.ids.length > 0) {
        where.id = { in: query.ids }
      }

      if (query.names && query.names.length > 0) {
        where.name = { in: query.names }
      }

      const count = await this.prisma.tranfer_type.count({ where })
      return count
    } catch (err: any) {
      //console.log(err.message)
      throw new SqlServerError("database error")
    }
  }

  async delete(id: number): Promise<Transfer> {
    try {
      const transfer: TransferModel = await this.prisma.tranfer_type.update({
        where: { id },
        data: { is_deleted: true }
      });

      return TransferModel.toDomain(transfer);
    } catch (err: any) {
      //console.log(err.message)
      throw new SqlServerError("database error")
    }
  }

}