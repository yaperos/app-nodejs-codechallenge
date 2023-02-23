'use strict';

const commonLayerPath = process.env.IS_OFFLINE ? './../../layers/src/common/nodejs' : '/opt/nodejs';
const SecretsManagerClient = require(commonLayerPath + '/services/SecretsManagerClient');
const KafkaClient = require(commonLayerPath + '/services/KafkaClient');
const { TRANSACTION_MAX_VALUE, TRANSACTION_VALIDATED_TOPIC } = process.env


module.exports.handler = (async (event) => {
  const kafkaSecrets = await SecretsManagerClient.getSecretValue('kafka')

  for (let key in event.records) {
    const record = event.records[key][0]
    const transaction = JSON.parse(Buffer.from(record.value, 'base64').toString())
    if (transaction.value > TRANSACTION_MAX_VALUE)
      transaction.status = 'rejected'
    else
      transaction.status = 'approved'

    const kafka = new KafkaClient({
      brokers: [kafkaSecrets.broker],
      ...kafkaSecrets
    });

    await kafka.sendEvent({
      topic: TRANSACTION_VALIDATED_TOPIC,
      messages: [{ value: JSON.stringify(transaction) }]
    })
  }
});