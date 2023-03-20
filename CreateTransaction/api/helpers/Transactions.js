const uuid = require(`uuid`)

// Init logger
const path = require(`path`)
const scriptName = path.basename(__filename)
const logger = require(`@loaders/logger`)(scriptName)

module.exports = {

    createTransaction() {
        const guid = uuid.v4()
        const randomAmount = Math.floor(Math.random() * 1300) + 1
        const isDebitTransaction = Math.random() < 0.5
        const accountExternalIdDebit = (isDebitTransaction) ? guid : ''
        const accountExternalIdCredit = (isDebitTransaction) ? '' : guid

        const transaction = {
            accountExternalIdDebit,
            accountExternalIdCredit,
            "tranferTypeId": 1,
            "value": randomAmount
        }

        return transaction
    }
}