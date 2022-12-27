export const EnvConfig = {
  port: process.env.PORT || 3000,
  whiteList: process.env.WHITE_LIST?.split(',') || ['*'],
  pathTransactions: process.env.PATH_TRANSACTIONS || 'http://localhost:3001',
}
