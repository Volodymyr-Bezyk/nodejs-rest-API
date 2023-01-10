const jwt = require("jsonwebtoken");

const checkJwt = (req, res, next) => {
  try {
    const token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : null;

    if (!token) return res.status(401).json({ message: "Not authorized" });
    req.owner = jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (error) {
    next(error);
  }
};
module.exports = { checkJwt };
