const { getCurrentDateTime } = require(`@api/helpers/Datetime`)

// Init logger
const path = require(`path`)
const scriptName = path.basename(__filename)
const logger = require(`@loaders/logger`)(scriptName)

module.exports = {

    validateTransaction(dataTransaction) {
        let validation = false
        const { value } = dataTransaction
        const isApproved = Math.random() < 0.5

        if (value > 1000) return validation
        
        validation = (isApproved) ? true : false

        return validation
    },

    updatingTransaction ({ transactionExternalId, dataTransaction, validation }) {
        const { accountExternalIdDebit, value } = dataTransaction
        const transactionType = (accountExternalIdDebit) ? `Debit`: `Credit`
        const status = (validation) ? `Approved`: `Rejected`

        const newDataTransaction = {
            transactionExternalId,
            transactionType: {
              name: transactionType
            },
            transactionStatus: {
              name: status
            },
            value,
            createdAt: getCurrentDateTime()
          }
        
        return newDataTransaction
    }
}