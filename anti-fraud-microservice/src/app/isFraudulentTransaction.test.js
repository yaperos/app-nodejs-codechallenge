const { describe, it } = require('node:test')
const assert = require('node:assert')

const isFraudulentTransaction = require('./isFraudulentTransaction')

describe('AntiFraud - IsFraudulentTransaction', () => {
  it('Transaction with a value less than one thousand is not fraudulent', async () => {
    const isFraudulent = await isFraudulentTransaction({
      transactionExternalId: '04eaa16c-203e-4554-bc02-9ff37bf2a060',
      value: 456.78,
    })
    assert.strictEqual(isFraudulent, false)
  })
  it('Transaction with a value greater than one thousand is fraudulent', async () => {
    const isFraudulent = await isFraudulentTransaction({
      transactionExternalId: '04eaa16c-203e-4554-bc02-9ff37bf2a060',
      value: 1456.78,
    })
    assert.strictEqual(isFraudulent, true)
  })

  it('Transaction with a value equal to one thousand is not fraudulent', async () => {
    const isFraudulent = await isFraudulentTransaction({
      transactionExternalId: '04eaa16c-203e-4554-bc02-9ff37bf2a060',
      value: 1000.00,
    })
    assert.strictEqual(isFraudulent, false)
  })
})
