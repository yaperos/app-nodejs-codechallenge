

class DeleteTransactionCommand {
  constructor (dbTransactions) {
    this.dbTransactions = dbTransactions
  }

  async execute (transactionId) {
    if (!transactionId) {
      return false
    }

    const deleted = await this.dbTransactions.delete(transactionId)
    return {action: deleted.command, count: deleted.rowCount}
  }
}

module.exports = DeleteTransactionCommand
