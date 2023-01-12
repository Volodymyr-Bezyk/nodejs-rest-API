const tryCatchWrap = (someFunc) => async (req, res, next) =>
  await someFunc(req, res, next).catch((err) => next(err));

const errorHandler = (error, _, res, __) => {
  if (
    error.name === "ValidationError" ||
    error.name === "CastError" ||
    error.isJoi
  )
    return res.status(400).json({
      code: error.code,
      message: "Validation error. Joi error or another library error",
      info: error.message,
    });

  if (error.code === 11000)
    return res.status(409).json({
      message: "Email in use",
    });

  return res.status(error.status ?? 500).json({
    status: "fail",
    message: error.message,
  });
};

const wrongPathHandler = (_, res, __) =>
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Use api on routes: /api/contacts",
    data: "Not found",
  });

module.exports = { tryCatchWrap, errorHandler, wrongPathHandler };
