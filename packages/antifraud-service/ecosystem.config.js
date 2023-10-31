module.exports = {
  apps: [
    {
      name: 'antifraud-service',
      script: './lib/index.js',
      watch: false,
      autorestart: true,
      ouput: './logs/antifraud-service-output.log',
      error: './logs/antifraud-service-error.log'
    }
  ]
}
