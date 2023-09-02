module.exports = {
  development: {
    username: 'postgres',
    password: 'postgres',
    database: 'prueba-yape',
    host: 'localhost',
    dialect: 'postgres',
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: 'postgres',
    dialect: 'postgres',
  }
};