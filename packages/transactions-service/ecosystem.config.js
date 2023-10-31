module.exports = {
  apps: [
    {
      name: 'transactions-service',
      script: './lib/index.js',
      watch: false,
      autorestart: true,
      ouput: './logs/transactions-service-output.log',
      error: './logs/transactions-service-error.log',
    }
  ]
}
