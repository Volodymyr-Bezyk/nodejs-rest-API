function errorHandler(cb, error, msg, status = 500) {
  error.info = msg;
  error.status = status;
  if (error.isJoi) error.status = 400;
  return cb(error);
}

module.exports = { errorHandler };
