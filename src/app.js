require('dotenv').config();
const express = require('express');
const connectDB = require('./config/mongo');

const app = express();
connectDB();

app.use(express.json());

app.use(require('./routes'));

module.exports = app;