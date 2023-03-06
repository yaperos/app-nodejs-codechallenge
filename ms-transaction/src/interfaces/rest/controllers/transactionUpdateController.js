const ResponseHttp = require('../responseHttp')
const dbTransactions = require('../../../infra/db/dbTransactions')
const UpdateTransactionCommand = require('../../../commands/updateTransactionCommand')

const transactionUpdateController = async (req, reply) => {
  const responseHttp = new ResponseHttp(200)
  try {
    const command = new UpdateTransactionCommand(dbTransactions)
    const response = await command.execute(req.params.transactionId, req.body)
    if (response === false || !response) {
      responseHttp.setCode(404)
    }
    responseHttp.setData(response)
  } catch (error) {
    responseHttp.setCode(500)
    responseHttp.setError('ERROR DE TRANSACTION_UPDATE_CONTROLLER', req.params, error.message)
  } finally {
    reply.code(responseHttp.code)
    reply.send(responseHttp.data)
  }
}

module.exports = transactionUpdateController
