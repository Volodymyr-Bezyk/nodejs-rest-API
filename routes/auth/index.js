const express = require("express");
const router = express.Router();
const {
  registrationController,
  loginController,
} = require("../../controller/auth");
const userRegSchema = require("../../service/schemas/userJoi");
const { validateBody } = require("../../middlewares/validateBody");
const { tryCatchWrap } = require("../../helpers");

router.post(
  "/register",
  validateBody(userRegSchema),
  tryCatchWrap(registrationController)
);

router.post(
  "/login",
  validateBody(userRegSchema),
  tryCatchWrap(loginController)
);

module.exports = router;
