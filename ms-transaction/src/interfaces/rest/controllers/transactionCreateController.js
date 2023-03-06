const ResponseHttp = require('../responseHttp')
const dbTransactions = require('../../../infra/db/dbTransactions')
const broker = require('../../../infra/broker/broker')
const CreateTransactionCommand = require('../../../commands/createTransactionCommand')

const transactionCreateController = async (req, reply) => {
  const responseHttp = new ResponseHttp(201)
  try {
    const command = new CreateTransactionCommand(dbTransactions, broker)
    const response = await command.execute(req.body)
    if (response === false || typeof response !== 'string') {
      responseHttp.setCode(404)
    }
    responseHttp.setData(response)
  } catch (error) {
    responseHttp.setCode(500)
    responseHttp.setError('ERROR TRANSACTION_CREATE_CONTROLLER', req.body, error.message)
  } finally {
    reply.code(responseHttp.code)
    reply.send(responseHttp.data)
  }
}

module.exports = transactionCreateController
