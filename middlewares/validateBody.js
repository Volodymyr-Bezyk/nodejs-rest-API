const validateBody = (schema) => {
  return async (req, _, next) => {
    const { error } = await schema.validate(req.body);
    if (error) return next(error);

    return next();
  };
};

module.exports = {
  validateBody,
};
