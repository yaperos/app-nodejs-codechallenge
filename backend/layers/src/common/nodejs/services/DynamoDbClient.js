"use strict";

const { DynamoDB } = require("aws-sdk");

let db = new DynamoDB.DocumentClient();

if (process.env.IS_OFFLINE) {
  db = new DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
    accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
    secretAccessKey: 'DEFAULT_SECRET'
  });
}

class DynamoDbClient {
  static async save({
    tableName,
    conditionExpression,
    expressionAttributeNames,
    item,
  }) {
    try {
      await db
        .put({
          TableName: tableName,
          ConditionExpression: conditionExpression,
          ExpressionAttributeNames: expressionAttributeNames,
          Item: item,
        })
        .promise();
    } catch (e) {
      console.log("Error on DynamoDbClient:save", e);
      throw e;
    }
  }

  static async query(params) {
    return await db.query(params).promise();
  }

  static async scan(params) {
    return await db.scan(params).promise();
  }

  static async update(params) {
    return await db.update(params).promise();
  }

  static async getByKey({ tableName, key }) {
    return await db
      .get({
        TableName: tableName,
        Key: key,
      })
      .promise();
  }

  static async queryByIndex({ tableName, index }) {
    return await db
      .query({
        TableName: tableName,
        IndexName: index.name,
        KeyConditionExpression: `#${index.attribute} = :${index.attribute}`,
        ExpressionAttributeNames: {
          [`#${index.attribute}`]: `${index.attribute}`,
        },
        ExpressionAttributeValues: {
          [`:${index.attribute}`]: index.value,
        },
      })
      .promise();
  }

  static async queryByComposeIndex({ tableName, index }) {
    return await db
      .query({
        TableName: tableName,
        IndexName: index.name,
        KeyConditionExpression: `#${index.pk.attribute} = :${index.pk.attribute} and #${index.sk.attribute} = :${index.sk.attribute}`,
        ExpressionAttributeNames: {
          [`#${index.pk.attribute}`]: `${index.pk.attribute}`,
          [`#${index.sk.attribute}`]: `${index.sk.attribute}`,
        },
        ExpressionAttributeValues: {
          [`:${index.pk.attribute}`]: index.pk.value,
          [`:${index.sk.attribute}`]: index.sk.value,
        },
      })
      .promise();
  }
}

module.exports = DynamoDbClient;
