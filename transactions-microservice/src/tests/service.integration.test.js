const { describe, it } = require('node:test')
const assert = require('node:assert')

const server = 'http://localhost:8000'

describe('Integration-Tests - Transactions Service', () => {
  it('Request Transactions API / Status ok', async () => {
    const response = await fetch(`${server}/`)
      .then(res => res.text())
    assert.strictEqual(response, 'api status: ok')
  })
})
