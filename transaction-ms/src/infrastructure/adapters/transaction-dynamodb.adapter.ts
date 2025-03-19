import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { TransactionRepository } from 'src/domain/repositories/transaction.repository';
import { TransactionEntity } from 'src/domain/entities/transaction.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionDynamoDBAdapter implements TransactionRepository {
  private readonly tableName = process.env.DYNAMODB_TABLE || 'TransactionsTable';
  private readonly dynamoDb: AWS.DynamoDB.DocumentClient;

  constructor() {
    this.dynamoDb = new AWS.DynamoDB.DocumentClient();
  }

  async save(transaction: TransactionEntity): Promise<TransactionEntity> {
    // Si no viene un transactionExternalId, generamos uno
    if (!transaction.transactionExternalId) {
      transaction.transactionExternalId = uuidv4();
    }
    const params = {
      TableName: this.tableName,
      Item: {
        ...transaction,
        createdAt: transaction.createdAt.toISOString(),
      },
    };
    await this.dynamoDb.put(params).promise();
    return transaction;
  }

  async findById(transactionExternalId: string): Promise<TransactionEntity | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        transactionExternalId,
      },
    };
    const result = await this.dynamoDb.get(params).promise();
    if (!result.Item) {
      return null;
    }
    return {
      ...result.Item,
      createdAt: new Date(result.Item.createdAt),
    } as TransactionEntity;
  }

  async updateStatus(transactionExternalId: string, status: string): Promise<TransactionEntity> {
    const params = {
      TableName: this.tableName,
      Key: {
        transactionExternalId,
      },
      UpdateExpression: 'SET transactionStatus = :status',
      ExpressionAttributeValues: {
        ':status': status,
      },
      ReturnValues: 'ALL_NEW',
    };
    const result = await this.dynamoDb.update(params).promise();
    return {
      ...result.Attributes,
      createdAt: new Date(result?.Attributes?.createdAt),
    } as TransactionEntity;
  }
}
