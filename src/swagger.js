const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuración principal de Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Yape Transactions API',
      version: '1.0.0',
      description: 'API for creating and retrieving financial transactions with anti-fraud validation',
    },
  },
  apis: ['./src/swagger-docs/*.js'], // Aquí van los archivos con tus JSDoc
};

const specs = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

module.exports = setupSwagger;
