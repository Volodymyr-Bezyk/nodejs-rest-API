const Joi = require("joi");

const userRegSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().alphanum().min(6).required(),
  subscription: Joi.string(),
  token: Joi.string(),
  avatarURL: Joi.string(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().alphanum().min(6).required(),
});

const userUpdateSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const userVerificationRequestSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
});

module.exports = {
  userRegSchema,
  userLoginSchema,
  userUpdateSchema,
  userVerificationRequestSchema,
};
