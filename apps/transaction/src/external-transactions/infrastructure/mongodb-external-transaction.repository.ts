import { Injectable } from '@nestjs/common';
import { ExternalTransactionRepository } from '../domain/external-transaction.repository';
import { InjectConnection } from '@nestjs/mongoose';
import { ExternalTransaction } from '../domain/external-transaction.entity';
import { Connection, mongo } from 'mongoose';

@Injectable()
export class MongodbExternalTransactionRepository
  implements ExternalTransactionRepository
{
  collectionName = 'externaltransactions';
  constructor(@InjectConnection() private connection: Connection) {}

  async create(
    doc: Partial<ExternalTransaction>,
  ): Promise<ExternalTransaction> {
    const externalTransaction = await this.connection
      .collection(this.collectionName)
      .insertOne(
        Object.assign(doc, {
          createdAt: new Date(),
          updatedAt: new Date(),
          status: ExternalTransaction.DEFAULT_STATUS,
        }),
      );

    return new ExternalTransaction(
      externalTransaction.insertedId.toString(),
      doc.transactionType,
      doc.accountExternalIdDebit,
      doc.accountExternalIdCredit,
      doc.value,
      doc.status,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  async findById(id: string): Promise<ExternalTransaction> {
    const externalTransaction = await this.connection
      .collection(this.collectionName)
      .findOne({ _id: new mongo.ObjectId(id) });

    return new ExternalTransaction(
      externalTransaction._id.toString(),
      externalTransaction.transactionType,
      externalTransaction.accountExternalIdDebit,
      externalTransaction.accountExternalIdCredit,
      externalTransaction.value,
      externalTransaction.status,
      externalTransaction.createdAt,
      externalTransaction.updatedAt,
    );
  }

  async updateStatusById(
    id: string,
    doc: Pick<ExternalTransaction, 'status'>,
  ): Promise<void> {
    await this.connection
      .collection(this.collectionName)
      .updateOne(
        { _id: new mongo.ObjectId(id) },
        { $set: { status: doc.status, updatedAt: new Date() } },
      );
  }
}
