const dbTools = require('./infra/db/dbConn')
const listeners = require('./interfaces/listeners')
const buildFastify = require('./interfaces/rest/server')

async function run () {
  await dbTools.DBConnect()
  await listeners.subscribe()
  buildFastify()
}

run()
