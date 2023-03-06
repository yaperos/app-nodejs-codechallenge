const Transaction = require('../domain/entities/transaction')

class CheckTransactionCommand {
  constructor (dbTransactions) {
    this.dbTransactions = dbTransactions
  }

  async execute (data) {
    console.log(data, 'CheckTransactionCommand')
    if (!data) {
      return false
    }
    const transactionExternalId = data.transactionExternalId
    const transactionStatus = data.status
    const updated = await this.dbTransactions.update(transactionExternalId, transactionStatus)
    return {action: updated.command, count: updated.rowCount}
  }
}

module.exports = CheckTransactionCommand
