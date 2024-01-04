const { describe, it } = require('node:test')
const assert = require('node:assert')

const { randomUUID } = require('node:crypto')
const { initKafka, eventualQueueMember } = require('./kafka-helper')

const kafkaInit = initKafka({
  clientId: 'anti-fraud-testing',
  brokers: ['localhost:9092'],
  groupId: 'anti-fraud-testing',
  topic: 'anti-fraud',
})

describe('Integration-Tests - Anti-Fraud', () => {
  it('Create a transaction and receive a message', async () => {
    const sendMessage = await kafkaInit

    const record = {
      transactionExternalId: randomUUID(),
      transactionTypeId: 1,
      value: 1000.00,
      createdAt: new Date().toISOString(),
    }

    await sendMessage('transactions', record)

    const receivedMessage = await eventualQueueMember(
      message => message.transactionExternalId === record.transactionExternalId,
      record.transactionExternalId,
      1000,
    )

    assert.strictEqual(receivedMessage.transactionExternalId, record.transactionExternalId)
  })

  it('Create a transaction not fraudulent', async () => {
    const sendMessage = await kafkaInit

    const record = {
      transactionExternalId: randomUUID(),
      transactionTypeId: 1,
      value: 10.41,
      createdAt: new Date().toISOString(),
    }

    await sendMessage('transactions', record)

    const receivedMessage = await eventualQueueMember(
      message => message.transactionExternalId === record.transactionExternalId,
      record.transactionExternalId,
      1000,
    )

    assert.strictEqual(receivedMessage.transactionExternalId, record.transactionExternalId)
    assert.strictEqual(receivedMessage.isFraudulent, false)
  })

  it('Create a transaction fraudulent', async () => {
    const sendMessage = await kafkaInit

    const record = {
      transactionExternalId: randomUUID(),
      transactionTypeId: 1,
      value: 9600.00,
      createdAt: new Date().toISOString(),
    }

    await sendMessage('transactions', record)

    const receivedMessage = await eventualQueueMember(
      message => message.transactionExternalId === record.transactionExternalId,
      record.transactionExternalId,
      1000,
    )

    assert.strictEqual(receivedMessage.transactionExternalId, record.transactionExternalId)
    assert.strictEqual(receivedMessage.isFraudulent, true)
  })

  it('Create a transaction with a value equal to one thousand is not fraudulent', async () => {
    const sendMessage = await kafkaInit

    const record = {
      transactionExternalId: randomUUID(),
      transactionTypeId: 1,
      value: 1000.00,
      createdAt: new Date().toISOString(),
    }

    await sendMessage('transactions', record)

    const receivedMessage = await eventualQueueMember(
      message => message.transactionExternalId === record.transactionExternalId,
      record.transactionExternalId,
      1000,
    )

    assert.strictEqual(receivedMessage.transactionExternalId, record.transactionExternalId)
    assert.strictEqual(receivedMessage.isFraudulent, false)
  })

  it('A transaction with invalid data is ignored', async () => {
    const sendMessage = await kafkaInit

    const record = {
      transactionExternalId: randomUUID(),
      transactionTypeId: 'ID_TYPE',
      value: '1000.00$$$',
      createdAt: new Date().toISOString(),
    }

    await sendMessage('transactions', record)

    try {
      const receivedMessage = await eventualQueueMember(
        message => message.transactionExternalId === record.transactionExternalId,
        record.transactionExternalId,
        10,
      )
      assert.fail(`Should not have received a message: ${receivedMessage}`)
    } catch (error) {
      assert.match(error.message, /Failed to get/)
    }
  })
})
