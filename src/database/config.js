import dotenv from 'dotenv'

dotenv.config()

export const dbEnvironments = {
  development: {
    user: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    database: process.env.DB_NAME_DEV,
    host: process.env.DB_HOST_DEV,
    port: process.env.DB_PORT_DEV,
    dialect: 'mysql'
  }
}
