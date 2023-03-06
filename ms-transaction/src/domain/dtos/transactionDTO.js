class TransactionDTO {
  constructor (data) {
    this.transactionId = data.id
    this.transactionExternalId = data.transaction_external_id
    this.transactionType = {
      name: data.transaction_type
    }
    this.transactionStatus = {
      name: data.status
    }
    this.value = data.value
    this.createdAt = data.created_at
  }
}

module.exports = TransactionDTO
