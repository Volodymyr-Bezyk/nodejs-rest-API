const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().alphanum().min(4).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().max(12).required(),
  favorite: Joi.boolean(),
  owner: Joi.string(),
});

const updateContactSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const replaceContactSchema = Joi.object({
  name: Joi.string().alphanum().min(4).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().max(12).required(),
  favorite: Joi.boolean().required().required(),
});

module.exports = { contactSchema, updateContactSchema, replaceContactSchema };
