// netlify/functions/express.js
const express = require('express');
const serverless = require('serverless-http');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Express on Netlify!');
});

module.exports.handler = serverless(app);