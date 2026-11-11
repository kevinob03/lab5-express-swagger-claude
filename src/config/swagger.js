const swaggerJsdoc = require('swagger-jsdoc');

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Laboratorio 5: API de notas + DeepSeek', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3000' }],
    tags: [
      { name: 'Notas', description: 'Operaciones de notas' },
      { name: 'IA', description: 'Operaciones con DeepSeek' },
      { name: 'Documentación', description: 'Interfaz Swagger UI' },
    ],
    components: {
      schemas: {
        Nota: {
          type: 'object',
          required: ['titulo', 'contenido'],
          properties: {
            id: { type: 'integer', example: 1 },
            titulo: { type: 'string', minLength: 1, maxLength: 100 },
            contenido: { type: 'string', minLength: 1, maxLength: 5000 },
          },
        },
        Pregunta: {
          type: 'object',
          required: ['pregunta'],
          properties: {
            pregunta: { type: 'string', minLength: 3, maxLength: 2000 },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
});

swaggerSpec.paths['/api-docs'] = {
  get: {
    summary: 'Abre la documentación interactiva Swagger UI',
    tags: ['Documentación'],
    responses: { 200: { description: 'Interfaz interactiva de la API' } },
  },
};

module.exports = swaggerSpec;
