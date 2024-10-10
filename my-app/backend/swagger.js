const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
          title: 'API de Credenciais e Usuários',
          version: '1.0.0',
          description: 'Documentação da API para gerenciamento de credenciais e usuários',
        },
        servers: [
          {
            url: 'http://localhost:5000',
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          }
        },
        security: [
          {
            bearerAuth: []
          }
        ]
      },
      apis: ['./routersCredentials/*.js', './routersUsers/*.js'],
    };

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
