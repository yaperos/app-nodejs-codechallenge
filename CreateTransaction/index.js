require(`module-alias/register`)

const config = require('@config')
const express = require('express');
const http = require(`http`)

// Init logger
const path = require(`path`)
const scriptName = path.basename(__filename)
const logger = require('@loaders/logger')(scriptName);

async function startServer() {
  const app = express();
  const server = http.createServer(app)

  // Load service settings
  await require('@loaders')({ expressApp: app })

  // Listen express server and open port
  server.listen(config.port, () => {
    logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
  }).on('error', err => {
    logger.error(err);
    process.exit(1);
  });
}

startServer();