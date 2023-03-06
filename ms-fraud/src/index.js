const db = require('./infra/db/dbConn')
const listeners = require('./interfaces/listeners')

async function run () {
  await db.connect()
  await listeners.subscribe()
}

run()
