const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Hotel Booking API',
    version: '1.0.0',
    description: 'API documentation for the Hotel Booking System',
    
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ]
};

// Options for the swagger docs
const options = {
  swaggerDefinition,
  apis: ['./routes/room/*.js'],
   // Path to the API routes
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
