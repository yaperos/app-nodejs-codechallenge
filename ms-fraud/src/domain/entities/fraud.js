
class Transaction {
  constructor (data, status) {
    this.transaction_external_id = data.transactionExternalId
    this.tranfer_type_id = data.type
    this.value = data.value
    this.status = status
  }
}

module.exports = Transaction
