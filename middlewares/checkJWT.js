const jwt = require("jsonwebtoken");
const { findUser } = require("../service/auth/index");

const checkJwt = (req, res, next) => {
  try {
    const token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : null;

    if (!token) return res.status(401).json({ message: "Not authorized" });

    jwt.verify(token, process.env.JWT_SECRET, async function (err, userData) {
      if (err) return res.status(401).json({ message: "Not authorized" });

      const user = await findUser(userData._id);
      if (!user || user.token !== token)
        return res.status(401).json({ message: "Not authorized" });

      req.owner = userData;
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { checkJwt };
