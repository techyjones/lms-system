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
        url: 'http://localhost:3000', // Adjust the URL based on your server
        description: 'Development server',
      },
    ],
  },
  // Path to the API specs
  apis: ['./routes/*.js'], // Adjust the path based on where your API routes are located
};

// Initialize Swagger docs
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Swagger UI setup
const swaggerSetup = swaggerUi.setup(swaggerDocs);
const swaggerRouter = swaggerUi.serve;

// Export Swagger setup for use in your app
module.exports = {
  swaggerRouter,
  swaggerSetup,
};
