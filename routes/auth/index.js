const express = require("express");
const router = express.Router();
const {
  registrationController,
  loginController,
  logOutController,
  currentUserController,
} = require("../../controller/auth");
const userRegSchema = require("../../service/schemas/userJoi");
const { validateBody } = require("../../middlewares/validateBody");
const { tryCatchWrap } = require("../../helpers");
const { checkJwt } = require("../../middlewares/checkJWT");

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

router.post("/logout", checkJwt, tryCatchWrap(logOutController));
router.post("/current", checkJwt, tryCatchWrap(currentUserController));

module.exports = router;
