const dbConn = require('./dbConn')
const client = dbConn.getDBConexion();
const table = 'frauds'
exports.insert = async (data) => {
  const date = new Date()
  const query = {
    text: 'INSERT INTO frauds(transaction_external_id, tranfer_type_id, value, status, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6)',
    values: [data.transaction_external_id, data.tranfer_type_id, data.value, data.status, date, date],
  }
  return await client.query(query)
}

exports.findByExternalId = async (transactionExternalId) => {
  const query = {
    name: 'fetch-transaction-by-external-id',
    text: 'SELECT * FROM frauds WHERE transaction_external_id = $1',
    values: [transactionExternalId],
  }
  return await client.query(query)
}

exports.findOneId = async (id) => {
  const query = {
    name: 'fetch-transaction-by-id',
    text: 'SELECT * FROM frauds WHERE id = $1',
    values: [id],
  }
  return await client.query(query)
}

exports.list = async () => {
  return await client.query('select * from frauds')
}

exports.update = async (status, transactionId) => {
  const query = {
    text: 'UPDATE frauds SET status = $1, updated_at = $2 WHERE id = $3',
    values: [status, new Date(), transactionId ],
  }
  return await client.query(query)
}

exports.delete = async (transactionId) => {
  const query = {
    text: 'DELETE FROM frauds WHERE id = $1',
    values: [transactionId],
  }
  return await client.query(query)
}
