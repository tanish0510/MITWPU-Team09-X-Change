const express = require('express');
const cors = require('cors');
const exchangeRateRoutes = require('./routes/exchangeRateRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/exchangeRates', exchangeRateRoutes);

// Optional: You might want to add an error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
