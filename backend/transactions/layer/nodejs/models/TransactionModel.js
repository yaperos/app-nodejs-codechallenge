'use strict';

const commonLayerPath = process.env.IS_OFFLINE ? './../../../../layers/src/common/nodejs' : '/opt/nodejs';
const SecretsManagerClient = require(commonLayerPath + '/services/SecretsManagerClient');
const DynamoDbClient = require(commonLayerPath + '/services/DynamoDbClient');
const KafkaClient = require(commonLayerPath + '/services/KafkaClient');
const DateTime = require(commonLayerPath + "/lib/DateTime");

const { ENV, APP_NAME } = process.env;

class TransactionModel {
  static TABLE_NAME = `${APP_NAME}-transactions-${ENV}`;
  static CREATED_TOPIC = 'created-transaction';
  static PARTITION_KEY_NAME = "id";

  constructor({
    id,
    accountExternalIdDebit,
    accountExternalIdCredit,
    tranferTypeId,
    value,
    status = 'pending',
    createdAt,
    updatedAt
  }) {
    this.id = id
    this.accountExternalIdDebit = accountExternalIdDebit;
    this.accountExternalIdCredit = accountExternalIdCredit;
    this.tranferTypeId = tranferTypeId;
    this.value = value;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toDynamoDb() {
    return {
      id: this.id,
      status: this.status,
      accountExternalIdDebit: this.accountExternalIdDebit,
      accountExternalIdCredit: this.accountExternalIdCredit,
      tranferTypeId: this.tranferTypeId,
      value: this.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  async save() {
    const isNewRecord = typeof this.createdAt === "undefined";
    const now = new DateTime().format();

    if (isNewRecord) {
      this.createdAt = now;
    } else {
      this.updatedAt = now;
    }

    let dynamoParams = {
      tableName: TransactionModel.TABLE_NAME,
      item: this.toDynamoDb(),
    };

    if (isNewRecord) {
      dynamoParams.conditionExpression = `attribute_not_exists(${TransactionModel.PARTITION_KEY_NAME})`;
    }

    await DynamoDbClient.save(dynamoParams);
  }

  async sendCreatedEvent() {
    const kafkaSecrets = await SecretsManagerClient.getSecretValue('kafka')

    const kafka = new KafkaClient({
      brokers: [kafkaSecrets.broker],
      ...kafkaSecrets
    });

    await kafka.sendEvent({
      topic: TransactionModel.CREATED_TOPIC,
      messages: [{ value: JSON.stringify(this.toPublicJson()) }]
    })
  }

  update(newValues) {
    for (const key in newValues) {
      if (key in this) {
        this[key] = newValues[key];
      }
    }
  }

  toPublicJson() {
    return {
      id: this.id,
      status: this.status,
      accountExternalIdDebit: this.accountExternalIdDebit,
      accountExternalIdCredit: this.accountExternalIdCredit,
      tranferTypeId: this.tranferTypeId,
      value: this.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static async getById(id) {
    let transaction = null;

    const data = await DynamoDbClient.query({
      TableName: TransactionModel.TABLE_NAME,
      KeyConditionExpression: `id = :id`,
      ExpressionAttributeValues: {
        ":id": id,
      },
    });

    if (data && data.Items && data.Items[0]) {
      transaction = new TransactionModel(data.Items[0]);
    }

    return transaction;
  }

}

module.exports = TransactionModel;