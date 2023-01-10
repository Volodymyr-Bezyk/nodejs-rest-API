const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { registerUser, loginUser } = require("../../service/auth");

const registrationController = async (req, res, next) => {
  const user = await registerUser(req.body);
  return res.status(201).json({ user: user.userData() });
};

const loginController = async (req, res, next) => {
  const user = await loginUser(req.body.email);

  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return res.status(401).json({ message: "Email or password is wrong" });

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  return res.status(200).json({ token, user: user.userData() });
};

module.exports = { registrationController, loginController };
