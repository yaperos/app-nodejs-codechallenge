const Transaction = require('../domain/entities/transaction')

class CreateTransactionCommand {
  constructor (dbTransactions, broker) {
    this.dbTransactions = dbTransactions
    this.broker = broker
  }

  async execute (data) {
    if (!data) {
      return false
    }
    const externalId = data.accountExternalIdDebit || data.accountExternalIdCredit
    const exists = await this.dbTransactions.findByExternalId(externalId)
    if (exists.rowCount > 0){
      throw new Error("Duplicate transaction")
    }

    const transaction = new Transaction(data)
    const saved = await this.dbTransactions.insert(transaction)

    if (saved.rowCount > 0) {
      const data = {
        transactionExternalId: transaction.transaction_external_id,
        value: transaction.value,
        type: transaction.tranfer_type_id
      }
      await this.sendMessage(data)
    }
    return {action: saved.command, count: saved.rowCount}
  }

  async sendMessage (data) {
    await this.broker.send('read-transaction', [{value: JSON.stringify(data)}])
  }
}

module.exports = CreateTransactionCommand
