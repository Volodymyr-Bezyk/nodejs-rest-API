function tryCatchHandler(someFunc, errorInfo) {
  try {
    return someFunc();
  } catch (err) {
    err.info = errorInfo;
    return err;
  }
}

module.exports = { tryCatchHandler };
