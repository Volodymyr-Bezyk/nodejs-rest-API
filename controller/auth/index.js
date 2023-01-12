const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  registerUser,
  loginUser,
  findUser,
  updateUserStatus,
} = require("../../service/auth");

const registrationController = async (req, res, next) => {
  const user = await registerUser(req.body);
  return res.status(201).json({ user: user.userData() });
};

const loginController = async (req, res, next) => {
  const user = await loginUser(req.body.email);

  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return res.status(401).json({ message: "Email or password is wrong" });

  user.token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  await user.save();

  return res.status(200).json({ token: user.token, user: user.userData() });
};

const logOutController = async (req, res, next) => {
  const user = await findUser(req.owner._id);
  if (!user) return res.status(401).json({ message: "Not authorized" });

  user.token = "";
  await user.save();
  return res.status(204).json({});
};

const currentUserController = async (req, res, next) => {
  const user = await findUser(req.owner._id);
  if (!user) return res.status(401).json({ message: "Not authorized" });
  return res.status(200).json({ user: user.userData() });
};

const updateUserStatusController = async (req, res, next) => {
  await updateUserStatus(req.owner._id, req.body);

  return res.status(200).json({ message: "User status updated" });
};

module.exports = {
  registrationController,
  loginController,
  logOutController,
  currentUserController,
  updateUserStatusController,
};
