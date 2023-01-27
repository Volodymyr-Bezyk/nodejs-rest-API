const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const tryCatchWrap = (someFunc) => async (req, res, next) => {
  try {
    console.log("111111111111");
    return await someFunc(req, res, next);
  } catch (error) {
    console.log("222222222222");
    next(error);
  }
};

const errorHandler = (error, _, res, __) => {
  if (
    error.name === "ValidationError" ||
    error.name === "CastError" ||
    error.isJoi
  ) {
    return res.status(400).json({
      code: error.code,
      message: "Validation error. Joi error or another library error",
      info: error.message,
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      message: "Email in use",
    });
  }

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

const sendVerificationEmail = async (req, verificationToken) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: req.body.email,
    from: "epf.volodymyr@gmail.com",
    subject: "Please verify your account",
    text: `To confirm your email please click on the link ${
      req.protocol
    }://${req.get("host")}/api/users/verify/${verificationToken}`,

    html: `<p>To confirm your email please click on the <strong><a href='${
      req.protocol
    }://${req.get(
      "host"
    )}/api/users/verify/${verificationToken}'>link</a></strong></p>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  tryCatchWrap,
  errorHandler,
  wrongPathHandler,
  sendVerificationEmail,
};
