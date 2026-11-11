const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/notas', require('./routes/notas.routes'));
app.use('/api/ia', require('./routes/ia.routes'));
app.use(require('./middlewares/errorHandler'));

module.exports = app;
