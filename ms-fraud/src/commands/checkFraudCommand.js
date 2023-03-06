const broker = require('../infra/broker/broker')
const Fraud = require('../domain/entities/fraud')
const { v4: uuidv4 } = require('uuid');

class CheckFraudCommand {
  constructor (dbFrauds) {
    this.dbFrauds = dbFrauds
  }

  async execute (data) {
    console.log(data, 'CheckFraudCommand')
    if (!data) {
      return false
    }

    const exists = await this.dbFrauds.findByExternalId(data.transactionExternalId)
    if (exists.rowCount > 0){
      throw new Error("Duplicate fraud")
    }
    const status = this.fraudCheck(data.value)
    const fraud = new Fraud(data, status)
    const saved = await this.dbFrauds.insert(fraud)
    data.status = status
    await this.sendMessage(data)
    return {action: saved.command, count: saved.rowCount}
  }

  fraudCheck (value) {
    let status = 'approved'
    if (value > 1000) status = 'rejected'
    return status
  }

  async sendMessage (data) {
    await broker.send('check-transaction', [{value: JSON.stringify(data)}])
  }

}

module.exports = CheckFraudCommand
