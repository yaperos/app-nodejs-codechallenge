const TransactionDTO = require('../domain/dtos/transactionDTO')

class GetTransactionQuery {
  constructor (dbTransactions) {
    this.dbTransactions = dbTransactions
  }

  async execute (id) {
    if (!id) {
      return false
    }

    let transaction = await this.dbTransactions.findOneId(id)
    transaction = new TransactionDTO(transaction.rows[0])
    return transaction
  }
}

module.exports = GetTransactionQuery
