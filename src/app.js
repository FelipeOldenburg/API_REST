require('dotenv').config();
const express = require('express');
const connectDB = require('./config/mongo');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/config');

const app = express();
connectDB();

app.use(express.json());

app.use('/api-Oldenburg', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(require('./routes'));

app.use(express.static('public'));

module.exports = app;
