const dbConn = require('./dbConn')
const client = dbConn.getDBConexion();
const table = 'transactions'
exports.insert = async (data) => {
  const date = new Date()
  const query = {
    text: 'INSERT INTO transactions(transaction_external_id, account_external_id_debit, account_external_id_credit, tranfer_type_id, value, status, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
    values: [data.transaction_external_id, data.account_external_id_debit, data.account_external_id_credit, data.tranfer_type_id, data.value, data.status, date, date],
  }
  return await client.query(query)
}

exports.findByExternalId = async (externalId) => {
  const query = {
    name: 'fetch-transaction-by-external-id',
    text: 'SELECT * FROM transactions WHERE account_external_id_debit = $1 OR account_external_id_credit = $2',
    values: [externalId, externalId],
  }
  return await client.query(query)
}

exports.findOneId = async (id) => {
  const query = {
    name: 'fetch-transaction-by-id',
    text: 'SELECT * FROM transactions WHERE id = $1',
    values: [id],
  }
  return await client.query(query)
}

exports.list = async () => {
  return await client.query('select * from transactions')
}

exports.update = async (transactionExternalId, transactionStatus) => {
  const query = {
    text: 'UPDATE transactions SET status = $1, updated_at = $2 WHERE transaction_external_id = $3',
    values: [transactionStatus, new Date(), transactionExternalId ],
  }
  return await client.query(query)
}

exports.delete = async (transactionId) => {
  const query = {
    text: 'DELETE FROM transactions WHERE id = $1',
    values: [transactionId],
  }
  return await client.query(query)
}
