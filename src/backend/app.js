const express = require('express');
const { add, subtract, multiply, divide } = require('./utils');

const app = express();
const ops = { add, subtract, multiply, divide };

app.get('/health', (req, res) => res.json({ status: 'UP' }));

app.get('/calc/:op', (req, res) => {
  const fn = ops[req.params.op];
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  if (!fn || Number.isNaN(a) || Number.isNaN(b)) {
    return res.status(400).json({ error: 'Invalid operation or numbers' });
  }
  try {
    return res.json({ result: fn(a, b) });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

module.exports = app;
