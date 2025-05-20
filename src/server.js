const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
const { timeoutMiddleware, handleTimeout } = require('./middlewares/timeoutHandler');

const enhanceRoutes = require('./routes/enhanceRoutes');
const suggestionsRoutes = require('./routes/suggestionsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurer CORS pour autoriser les requêtes depuis web.whatsapp.com
app.use(cors({
  origin: ['https://web.whatsapp.com', 'http://localhost:*'], // Autoriser WhatsApp et localhost pour les tests
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(timeoutMiddleware);

app.use('/api/enhance', enhanceRoutes);
app.use('/api/suggestions', suggestionsRoutes);

app.use(handleTimeout);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;