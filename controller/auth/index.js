const bcrypt = require("bcryptjs");
const { registerUser, loginUser } = require("../../service/auth");

const registrationController = async (req, res, next) => {
  const { email, password, subscription = "starter" } = req.body;
  await registerUser({ email, password, subscription });
  return res.status(201).json({
    user: {
      email,
      subscription,
    },
  });
};

const loginController = async (req, res, next) => {
  const user = await loginUser(req.body.email);

  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return res.status(401).json({ message: "Email or password is wrong" });

  const { email, subscription } = user;
  return res
    .status(200)
    .json({ token: "example", user: { email, subscription } });
};

module.exports = { registrationController, loginController };
