require('dotenv').config();
const express = require('express');
const connectDB = require('./config/mongo');

const app = express();
connectDB();

app.use(express.json());

app.use(require('./routes'));

app.use(express.static('public'));

app.use(express.json({ limit: '10kb' }));

module.exports = app;