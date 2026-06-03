require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { tratamentoErros } = require('./middlewares/tratamentoErros');

const app = express();

app.use(express.json({ limit: '2mb' }));

const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:4200')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);

app.use('/api', routes);

app.use(tratamentoErros);

module.exports = app;
