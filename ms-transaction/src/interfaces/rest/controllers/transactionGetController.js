const ResponseHttp = require('../responseHttp')
const dbTransactions = require('../../../infra/db/dbTransactions')
const GetTransactionQuery = require('../../../queries/getTransactionQuery')

const transactionGetController = async (req, reply) => {
  const responseHttp = new ResponseHttp(200)
  try {
    const query = new GetTransactionQuery(dbTransactions)
    const response = await query.execute(req.params.transactionId)
    if (response === false) {
      responseHttp.setCode(404)
    }
    responseHttp.setDataCustom(response)
  } catch (error) {
    responseHttp.setCode(500)
    responseHttp.setError('ERROR DE TRANSACTION_GET_CONTROLLER', req.params, error.message)
  } finally {
    reply.code(responseHttp.code)
    reply.send(responseHttp.data)
  }
}

module.exports = transactionGetController
