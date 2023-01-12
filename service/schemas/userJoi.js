const Joi = require("joi");

const userRegSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().alphanum().min(4).max(8).required(),
  subscription: Joi.string(),
  token: Joi.string(),
});

const userUpdateSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

module.exports = { userRegSchema, userUpdateSchema };
