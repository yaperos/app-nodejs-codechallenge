class FraudDTO {
  constructor (data) {
    this.transactionId = data.id
    this.transactionExternalId = data.transaction_external_id
    this.type = data.type
    this.amount = data.amount
    this.status = data.status
  }
}

module.exports = FraudDTO
