const { describe, it } = require('node:test')
const assert = require('node:assert')
const { initKafka, eventualQueueMember } = require('./kafka-helper')

const server = 'http://localhost:8000'

let transactionExternalId = null

const kafkaInit = initKafka({
  clientId: 'transactions-testing',
  brokers: ['localhost:9092'],
  groupId: 'transactions-testing',
  topic: 'anti-fraud',
})

describe('Integration-Tests - Get Transaction Info', () => {
  it('Get information of a transaction', async () => {
    const transactionCreated = await fetch(`${server}/transactions/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountExternalIdDebit: '04eaa16c-203e-4554-bc02-9ff37bf2a060',
        accountExternalIdCredit: 'fc0a16f6-3db9-4eb5-a8ef-1d9e300e1f98',
        transferTypeId: 1,
        value: 100.00,
      }),
    })
      .then(res => res.json())

    transactionExternalId = transactionCreated.data.transactionExternalId

    const response = await fetch(`${server}/transactions/${transactionExternalId}`)
      .then(res => res.json())

    assert.match(response.message, /success/)
    assert.strictEqual(response.data.transactionExternalId, transactionExternalId)
    assert.match(response.data.transactionType.name, /Transfer/)
    assert.strictEqual(typeof response.data.value, 'number')
    assert.match(response.data.transactionStatus.name, /Pending|Approved|Rejected/)
    assert.match(response.data.createdAt, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })

  it('Get information of an invalid transaction', async () => {
    const response = await fetch(`${server}/transactions/123456789`)
      .then(res => res.json())

    assert.strictEqual(response.name, 'ValidationError')
    assert.match(response.message, /"transactionExternalId" must be a valid GUI/)
  })

  it('Get information of an inexistent transaction', async () => {
    const response = await fetch(`${server}/transactions/04eaa16c-203e-4554-bc02-9ff37bf2a060`)
      .then(res => res.json())

    assert.strictEqual(response.name, 'NotFoundError')
    assert.match(response.error, /04eaa16c-203e-4554-bc02-9ff37bf2a060 not found/)
  })

  it('Get information of an approved transaction', async () => {
    const transactionCreated = await fetch(`${server}/transactions/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountExternalIdDebit: '04eaa16c-203e-4554-bc02-9ff37bf2a060',
        accountExternalIdCredit: 'fc0a16f6-3db9-4eb5-a8ef-1d9e300e1f98',
        transferTypeId: 1,
        value: 123.00,
      }),
    })
      .then(res => res.json())

    transactionExternalId = transactionCreated.data.transactionExternalId

    await eventualQueueMember(
      message => message.transactionExternalId === transactionExternalId,
      transactionExternalId,
      1000,
    )

    const response = await fetch(`${server}/transactions/${transactionExternalId}`)
      .then(res => res.json())

    assert.match(response.message, /success/)
    assert.strictEqual(response.data.transactionExternalId, transactionExternalId)
    assert.match(response.data.transactionType.name, /Transfer/)
    assert.strictEqual(typeof response.data.value, 'number')
    assert.strictEqual(response.data.transactionStatus.name, 'Approved')
    assert.match(response.data.createdAt, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })

  it('Get information of an rejected transaction', async () => {
    const transactionCreated = await fetch(`${server}/transactions/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountExternalIdDebit: '04eaa16c-203e-4554-bc02-9ff37bf2a060',
        accountExternalIdCredit: 'fc0a16f6-3db9-4eb5-a8ef-1d9e300e1f98',
        transferTypeId: 1,
        value: 1234.00,
      }),
    })
      .then(res => res.json())

    transactionExternalId = transactionCreated.data.transactionExternalId

    await kafkaInit
    await eventualQueueMember(
      message => message.transactionExternalId === transactionExternalId,
      transactionExternalId,
      1000,
    )

    const response = await fetch(`${server}/transactions/${transactionExternalId}`)
      .then(res => res.json())

    assert.match(response.message, /success/)
    assert.strictEqual(response.data.transactionExternalId, transactionExternalId)
    assert.match(response.data.transactionType.name, /Transfer/)
    assert.strictEqual(typeof response.data.value, 'number')
    assert.strictEqual(response.data.transactionStatus.name, 'Rejected')
    assert.match(response.data.createdAt, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })
})
