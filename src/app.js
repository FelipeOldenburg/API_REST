require('dotenv').config();
const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/config');

const app = express();
const swaggerOptions = { swaggerOptions: { url: '/api-docs/swagger.json' } };

const allowedOrigins = (process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.get('origin');
  const allowOrigin = origin && (
    allowedOrigins.includes(origin) ||
    (!allowedOrigins.length && process.env.NODE_ENV !== 'production')
  );

  if (allowOrigin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.get('/api-docs/swagger.json', (req, res) => res.json(swaggerSpec));
app.use('/api-docs', swaggerUi.serveFiles(null, swaggerOptions), swaggerUi.setup(null, swaggerOptions));
app.use(require('./routes'));

app.use(express.static(path.join(__dirname, '../public')));

module.exports = app;
