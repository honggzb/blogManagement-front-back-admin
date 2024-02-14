import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: "1.0.0",
    title: 'API documents',
    description: 'API Swagger documents'
  },
  schemes: ['http', 'https'],
  consumes: ['application/json'],
    produces: ['application/json'],
  host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ['./api/routes/user.route.js', './api/routes/auth.route.js', './api/routes/note.route.js', './api/routes/comment.route.js'];

swaggerAutogen(outputFile, routes, doc);