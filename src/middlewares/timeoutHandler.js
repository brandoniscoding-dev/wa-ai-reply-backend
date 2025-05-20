const timeout = require('connect-timeout');
const logger = require('../utils/logger');

const timeoutMiddleware = timeout('10s');

function handleTimeout(req, res, next) {
  if (!req.timedout) return next();

  logger.warn(`Timeout: ${req.method} ${req.originalUrl}`);
  res.status(503).json({ error: 'Request timed out. Please try again.' });
}

module.exports = {
  timeoutMiddleware,
  handleTimeout
};
