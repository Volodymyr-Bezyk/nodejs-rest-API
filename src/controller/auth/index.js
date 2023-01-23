const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");
const sgMail = require("@sendgrid/mail");

const {
  registerUser,
  loginUser,
  findUser,
  updateUserStatus,
  verifyUser,
} = require("../../service/auth");
const { createMessageToVerifacation } = require("../../helpers");

const registrationController = async (req, res, next) => {
  req.body.verificationToken = nanoid();
  const user = await registerUser(req.body);
  user.avatarURL = gravatar.url(user.email, { s: 250 }, { protocol: "http" });
  await user.save();

  const msg = createMessageToVerifacation(req, req.body.verificationToken);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // try {
  //   await sgMail.send(msg);
  //   console.log("msg", msg);
  //   console.log("Email sent");
  // } catch (error) {
  //   console.error(error);
  // }

  // return res.status(201).json({ user: user.userData() });
  return res.status(201).json({ msg });
};

const verifyUserController = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await verifyUser(verificationToken);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.verificationToken = "-";
  await user.save();
  return res.status(200).json({ message: "Verification successful" });
};

const repeatedVerification = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "missing required field email" });
  }
  const user = await loginUser(email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.verify) {
    return res
      .status(400)
      .json({ message: "Verification has already been passed" });
  }

  const msg = createMessageToVerifacation(req, user.verificationToken);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // try {
  //   await sgMail.send(msg);
  //   console.log("msg", msg);
  //   console.log("Email sent");
  // } catch (error) {
  //   console.error(error);
  // }

  return res.status(200).json({ message: "Verification email sent", msg });
};

const loginController = async (req, res, next) => {
  const user = await loginUser(req.body.email);
  if (!user) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  if (!user.verify) {
    return res.status(401).json({ message: "Please verificate your account" });
  }

  const verifyPassword = await bcrypt.compare(req.body.password, user.password);
  if (!verifyPassword) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }

  user.token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  await user.save();

  return res.status(200).json({ token: user.token, user: user.userData() });
};

const logOutController = async (req, res, next) => {
  const user = await findUser(req.owner._id);
  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  user.token = "";
  await user.save();
  return res.status(204).json({});
};

const currentUserController = async (req, res, next) => {
  const user = await findUser(req.owner._id);
  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  return res.status(200).json({ user: user.userData() });
};

const updateUserStatusController = async (req, res, next) => {
  const updatedUser = await updateUserStatus(req.owner._id, req.body);
  if (!updatedUser) {
    return res.status(400).json({ message: "User not found" });
  }
  return res.status(200).json({ message: "User status updated" });
};

module.exports = {
  registrationController,
  loginController,
  logOutController,
  currentUserController,
  updateUserStatusController,
  verifyUserController,
  repeatedVerification,
};
