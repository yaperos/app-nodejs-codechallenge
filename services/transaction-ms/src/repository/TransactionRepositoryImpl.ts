import { randomUUID } from "crypto";
import { Cluster, MutateInSpec } from "couchbase";
import { Transaction, TransactionStatus } from "../domain/Transaction";
import { TransactionRepositoryI } from "./TransactionRepositoryI";

export interface TransactionRepositoryImplProps {
  cluster: Promise<Cluster>;
  bucketName: string;
}

export class TransactionRepositoryImpl implements TransactionRepositoryI {
  constructor(private props: TransactionRepositoryImplProps) {}

  private async getBucket() {
    const cluster = await this.props.cluster;
    return cluster.bucket(this.props.bucketName);
  }

  private async getCollection() {
    const bucket = await this.getBucket();
    return bucket.defaultCollection();
  }

  async findTransactionById(transaction: Transaction) {
    const collection = await this.getCollection();
    const result = await collection.get(transaction.transactionExternalId);
    return new Transaction(result.content);
  }
  async createTransaction(transaction: Transaction) {
    const collection = await this.getCollection();

    const request = new Transaction({
      ...transaction,
      transactionExternalId: randomUUID(),
      createdAt: new Date().getTime(),
      status: TransactionStatus.PENDING,
    });

    await collection.insert(request.transactionExternalId, request);

    return request;
  }

  async updateTransaction(transaction: Transaction) {
    const collection = await this.getCollection();

    await collection.mutateIn(transaction.transactionExternalId, [
      MutateInSpec.upsert("status", transaction.status),
      MutateInSpec.upsert("updatedAt", new Date().getTime()),
    ]);

    const response = await collection.get(transaction.transactionExternalId);

    return new Transaction(response.content);
  }
}
