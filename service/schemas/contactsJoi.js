const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().alphanum().min(4).max(20).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  phone: Joi.string().max(12).required(),
  favorite: Joi.boolean(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().alphanum().min(4).max(20),
  email: Joi.string().email({ minDomainSegments: 2 }),
  phone: Joi.string().max(12),
  favorite: Joi.boolean().required(),
});

module.exports = { contactSchema, updateContactSchema };
