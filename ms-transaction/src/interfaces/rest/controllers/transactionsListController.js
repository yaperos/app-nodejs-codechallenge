const ResponseHttp = require('../responseHttp')
const dbTransactions = require('../../../infra/db/dbTransactions')
const ListTransactionsQuery = require('../../../queries/listTransactionsQuery')

const transactionsListController = async (request, reply) => {
  const responseHttp = new ResponseHttp(200)
  try {
    const query = new ListTransactionsQuery(dbTransactions)
    const response = await query.execute(request.query.page, request.query.limit)
    if (response === false) {
      responseHttp.setCode(404)
    }
    responseHttp.setData(response)
  } catch (error) {
    responseHttp.setCode(500)
    responseHttp.setError('ERROR DE TRANSACTION_LIST_CONTROLLER', request.query, error.message)
  } finally {
    reply.code(responseHttp.code)
    reply.send(responseHttp.data)
  }
}

module.exports = transactionsListController
