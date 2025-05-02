const Joi = require('joi');

// Validation for grammar and spelling correction
const validateCorrect = (req, res, next) => {
  const schema = Joi.object({
    text: Joi.string().required(),
  });

  validate(schema, req, res, next);
};

// Validation for tone adjustment
const validateTone = (req, res, next) => {
  const schema = Joi.object({
    text: Joi.string().required(),
    tone: Joi.string().valid('formal', 'friendly', 'professional', 'casual', 'persuasive').required(),
  });

  validate(schema, req, res, next);
};

// Validation for size adjustment (shorten or expand)
const validateSize = (req, res, next) => {
  const schema = Joi.object({
    text: Joi.string().required(),
    size: Joi.string().valid('shorten', 'lengthen').required(),
  });

  validate(schema, req, res, next);
};

// Validation for translation
const validateTranslation = (req, res, next) => {
  const schema = Joi.object({
    text: Joi.string().required(),
    targetLanguage: Joi.string().required(),
  });

  validate(schema, req, res, next);
};

// Generic validation function
const validate = (schema, req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  validateCorrect,
  validateTone,
  validateSize,
  validateTranslation,
};
