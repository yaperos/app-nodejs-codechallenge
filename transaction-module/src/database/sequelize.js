/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { environmentVariables } from '../config/index.js'
import mysql from 'mysql2/promise'
import { Sequelize } from 'sequelize'

const { host, port, user, password, database } = environmentVariables.database

export async function initializeDb () {
  const connection = await mysql.createConnection({ host, port, user, password })
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`)
  await connection.end()
}

const sequelize = new Sequelize(database, user, password, {
  dialect: 'mysql',
  host
})

export default sequelize
