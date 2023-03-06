const TransactionDTO = require('../domain/dtos/transactionDTO')

class ListTransactionsQuery {
  constructor (dbTransactions) {
    this.dbTransactions = dbTransactions
  }

  async execute (page = 1, limit = 10) {
    page = parseInt(page)
    limit = parseInt(limit)
    const response = []
    const list = await this.dbTransactions.list({}, limit, page)
    list.rows.map(function (item) {
      response.push(new TransactionDTO(item))
    })
    return response
  }
}

module.exports = ListTransactionsQuery
