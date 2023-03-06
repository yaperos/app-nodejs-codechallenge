'use strict'
const { Client } = require('pg')
const {config} = require('../../common/config/env.config');
const client = new Client({
  host: config.db_host,
  port: config.db_port,
  user: config.db_user,
  password: config.db_password,
  database: config.db_database,
})

exports.DBConnect = async () => {
  if (!client) {
    return client;
  }

  // database connect
  await client.connect()
}

exports.getDBConexion = function () {
  if (client) {
    return client;
  }

  console.log('There is no client connection');
  return null;
}
