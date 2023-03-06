const { v4: uuidv4 } = require('uuid');

class Transaction {
  constructor (data) {
    this.transaction_external_id = uuidv4()
    this.account_external_id_debit = data.accountExternalIdDebit || ''
    this.account_external_id_credit = data.accountExternalIdCredit || ''
    this.tranfer_type_id = data.tranferTypeId
    this.value = data.value
    this.status = 'pending'
  }
}

module.exports = Transaction
