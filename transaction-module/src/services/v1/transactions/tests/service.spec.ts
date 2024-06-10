import Sinon from 'sinon'
import { expect } from 'chai'
import request from 'supertest'

import app from '../../../../app'
import * as mocks from './service.mock'
import { TransactionsDao } from '../../../../models/transactions/transactions.dao'
import { TransactionTypesDao } from '../../../../models/transaction-types/transaction-types.dao'
import { TransactionStatusDao } from '../../../../models/transaction-status/transaction-status.dao'
import { MessageQueueProducer } from '../../../../providers/message-broker-producer.provider'

describe('Transactions #Integration', function () {
  const aTransactionsDao = new TransactionsDao()
  const aTransactionTypesDao = new TransactionTypesDao()
  const aTransactionStatusDao = new TransactionStatusDao()

  before('Insert initial data', async () => {
    await aTransactionsDao.bulkCreate(mocks.transactionsMock)
    await aTransactionTypesDao.bulkCreate(mocks.transactionTypesMock)
    await aTransactionStatusDao.bulkCreate(mocks.transactionStatusMock)
  })

  after('Remove data', async () => {
    await aTransactionsDao.clearTable()
    await aTransactionTypesDao.clearTable()
    await aTransactionStatusDao.clearTable()
  })

  describe('GET - /api/v1/transactions', () => {
    it('When read transactions, then send all transactions', async () => {
      const endpoint = '/api/v1/transactions'

      const { body, status } = await request(app).get(`${endpoint}`)

      expect(body).to.be.eql(mocks.transactionResponseMock)
      expect(status).to.be.eql(200)
    })

    it('When read transactions with value filter, then send all transactions with those values', async () => {
      const endpoint = '/api/v1/transactions'

      const transactionsThatMatch = mocks.transactionResponseMock.data.filter((transaction) => transaction.value === 1111)

      const response = {
        data: transactionsThatMatch,
        pagination: {
          count: 1,
          limit: 20,
          page: 1
        }
      }

      const { body, status } = await request(app).get(`${endpoint}`).query({ value: 1111 })

      expect(body).to.be.eql(response)
      expect(status).to.be.eql(200)
    })

    it('When read transactions with transaction_id filter, then send the transaction with that id', async () => {
      const endpoint = '/api/v1/transactions'

      const transactionsThatMatch = mocks.transactionResponseMock.data.filter(
        (transaction) => transaction.transaction_id === 'ad161029-8f5b-4b2b-8ca9-20ffbf1d8963'
      )

      const response = {
        data: transactionsThatMatch,
        pagination: {
          count: 1,
          limit: 20,
          page: 1
        }
      }

      const { body, status } = await request(app)
        .get(`${endpoint}`)
        .query({ transaction_id: 'ad161029-8f5b-4b2b-8ca9-20ffbf1d8963' })

      expect(body).to.be.eql(response)
      expect(status).to.be.eql(200)
    })

    it('When a valid request is sent with limit, then returned limited', async () => {
      const endpoint = '/api/v1/transactions'

      const { body, status } = await request(app).get(`${endpoint}`).query({ limit: 1, page: 1 })

      expect(body).to.be.eql({
        data: [mocks.transactionResponseMock.data[0]],
        pagination: {
          limit: 1,
          page: 1,
          count: mocks.transactionResponseMock.data.length
        }
      })
      expect(status).to.be.eql(200)
    })
  })

  describe('POST - /api/v1/transactions', () => {
    const sandbox = Sinon.createSandbox()

    const kafka = MessageQueueProducer.getInstance()
    beforeEach(() => {
      sandbox.stub(kafka, 'connect').resolves()
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('When send required params, then create a transactions in DB', async () => {
      const endpoint = '/api/v1/transactions'

      const { body, status } = await request(app)
        .post(`${endpoint}`)
        .send(mocks.createdTransactionMock)

      delete body.data.updatedAt
      expect(body).to.be.eql({ data: mocks.createdTransactionMock })
      expect(status).to.be.eql(200)
    })
  })
})
