const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Define Swagger options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation for my Express application',
    },
    servers: [
      {
        url: 'http://localhost:3000', 
        description: 'Development server',
      },
    ],
  },
  
  apis: ['./routes/*.js'],
};

// Initialize Swagger docs
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Swagger UI setup
const swaggerSetup = swaggerUi.setup(swaggerDocs);
const swaggerRouter = swaggerUi.serve;


module.exports = {
  swaggerRouter,
  swaggerSetup,
};
