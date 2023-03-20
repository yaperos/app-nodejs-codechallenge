const Model = require(`@api/models/Model`)

class TransactionsModel extends Model {

  constructor () {
    super(`transactions`)
  }
  
}

module.exports = TransactionsModel
