const Joi = require("joi");

const userRegSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().alphanum().min(6).required(),
  subscription: Joi.string(),
  token: Joi.string(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().alphanum().min(6).required(),
});

const userUpdateSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

module.exports = { userRegSchema, userLoginSchema, userUpdateSchema };