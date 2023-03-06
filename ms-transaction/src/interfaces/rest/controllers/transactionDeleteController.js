const ResponseHttp = require('../responseHttp')
const dbTransactions = require('../../../infra/db/dbTransactions')
const DeleteTransactionCommand = require('../../../commands/deleteTransactionCommand')

const transactionDeleteController = async (req, reply) => {
  const responseHttp = new ResponseHttp(200)
  try {
    const command = new DeleteTransactionCommand(dbTransactions)
    const response = await command.execute(req.params.transactionId)
    if (response === false || !response) {
      responseHttp.setCode(404)
    }
    responseHttp.setData(response)
  } catch (error) {
    responseHttp.setCode(500)
    responseHttp.setError('ERROR DE TRANSACTION_DELETE_CONTROLLER', req.params, error.message)
  } finally {
    reply.code(responseHttp.code)
    reply.send(responseHttp.data)
  }
}

module.exports = transactionDeleteController
