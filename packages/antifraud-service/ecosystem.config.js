module.exports = {
  apps: [
    {
      name: 'antifraud-service',
      script: './lib/index.js',
      watch: false,
      autorestart: true,
      output: '/app/logs/antifraud-service-output.log',
      error: '/app/logs/antifraud-service-error.log'
    }
  ]
}
