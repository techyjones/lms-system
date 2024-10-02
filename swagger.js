const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

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
        url: 'http://localhost:3000', // Your API server URL in development
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to your route files for Swagger annotations
};

// Initialize Swagger docs
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Save the Swagger JSON to a file (optional, if you want to generate a file)
const fs = require('fs');
const swaggerJsonPath = path.join(__dirname, 'swagger.json');
fs.writeFileSync(swaggerJsonPath, JSON.stringify(swaggerDocs, null, 2), 'utf-8');

// Use the generated Swagger document to set up Swagger UI
const swaggerRouter = swaggerUi.serve;
const swaggerSetup = swaggerUi.setup(swaggerDocs); // Use swaggerDocs directly

// Export the router and setup function
module.exports = { swaggerRouter, swaggerSetup };
