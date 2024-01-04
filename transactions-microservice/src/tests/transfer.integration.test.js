const { describe, it } = require('node:test')
const assert = require('node:assert')

const server = 'http://localhost:8000'

describe('Integration-Tests - Transfer', () => {
  it('Request Transactions API / Status ok', async () => {
    const response = await fetch(`${server}/`)
      .then(res => res.text())
    assert.strictEqual(response, 'api status: ok')
  })

  it('Make a Transfer successfully', async () => {
    const response = await fetch(`${server}/transactions/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountExternalIdDebit: '04eaa16c-203e-4554-bc02-9ff37bf2a060',
        accountExternalIdCredit: 'fc0a16f6-3db9-4eb5-a8ef-1d9e300e1f98',
        transferTypeId: 1,
        value: 1000.00,
      }),
    })
      .then(res => res.json())

    assert.strictEqual(response.message, 'Transfer created successfully')
  })

  it('Make a Transfer and get transactionId', async () => {
    const response = await fetch(`${server}/transactions/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountExternalIdDebit: '04eaa16c-203e-4554-bc02-9ff37bf2a060',
        accountExternalIdCredit: 'fc0a16f6-3db9-4eb5-a8ef-1d9e300e1f98',
        transferTypeId: 1,
        value: 1000.00,
      }),
    })
      .then(res => res.json())

    const transactionId = response?.data?.transactionExternalId
    assert.strictEqual(!!transactionId, true)
  })

  it('Make a Transfer and save with status pending', async () => {
    const response = await fetch(`${server}/transactions/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountExternalIdDebit: '04eaa16c-203e-4554-bc02-9ff37bf2a060',
        accountExternalIdCredit: 'fc0a16f6-3db9-4eb5-a8ef-1d9e300e1f98',
        transferTypeId: 1,
        value: 1000.00,
      }),
    })
      .then(res => res.json())

    assert.strictEqual(response.data.transactionStatusId, 1)
  })

  it('Fail Transfer with invalid data', async () => {
    const response = await fetch(`${server}/transactions/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountExternalIdDebit: '04eaa16c-203e-4554-bc02',
        accountExternalIdCredit: 'fc0a16f6-1d9e300e1f98',
        transferTypeId: 'fc0a16f6-3db9-4eb5-a8ef-1d9e300e1f98',
        value: '1000.00$',
      }),
    })
      .then(res => res.json())

    assert.strictEqual(response.name, 'ValidationError')
    assert.match(response.message, /"accountExternalIdDebit" must be a valid GUI/)
    assert.match(response.message, /"accountExternalIdCredit" must be a valid GUI/)
    assert.match(response.message, /"value" must be a number/)
    assert.match(response.message, /"transferTypeId" must be a number/)
  })

  it('Fail Transfer with value 0', async () => {
    const response = await fetch(`${server}/transactions/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountExternalIdDebit: '04eaa16c-203e-4554-bc02-9ff37bf2a060',
        accountExternalIdCredit: 'fc0a16f6-3db9-4eb5-a8ef-1d9e300e1f98',
        transferTypeId: 1,
        value: 0,
      }),
    })
      .then(res => res.json())

    assert.strictEqual(response.name, 'ValidationError')
    assert.match(response.message, /"value" contains an invalid value/)
  })

  it('Fail Transfer with inexistent transferTypeId', async () => {
    const response = await fetch(`${server}/transactions/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountExternalIdDebit: '04eaa16c-203e-4554-bc02-9ff37bf2a060',
        accountExternalIdCredit: 'fc0a16f6-3db9-4eb5-a8ef-1d9e300e1f98',
        transferTypeId: 100,
        value: 1000.00,
      }),
    })
      .then(res => res.json())

    assert.strictEqual(response.name, 'BadRequestError')
    assert.match(response.error, /type 100 not found/)
  })
})
