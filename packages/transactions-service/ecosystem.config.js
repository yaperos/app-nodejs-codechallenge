module.exports = {
  apps: [
    {
      name: 'transactions-service',
      script: './lib/index.js',
      watch: false,
      autorestart: true,
      output: '/app/logs/transactions-service-output.log',
      error: '/app/logs/transactions-service-error.log',
    }
  ]
}
