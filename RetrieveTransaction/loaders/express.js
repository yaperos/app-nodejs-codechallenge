const express = require('express')
const cors = require('cors')
const routes = require('@/api')
const config = require('@/config')

module.exports = ({ app }) => {
  /**
   * Health Check endpoints
   */
  app.get('/status', (req, res) => {
    res.status(200).end();
  });

  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  // Config Cors
  app.use(cors({
    origin: `*`,
    credentials: false
  }))

  // Transforms the raw string of req.body into json
  app.use(express.json());

  // Load API routes
  app.use( routes() );

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });
};
