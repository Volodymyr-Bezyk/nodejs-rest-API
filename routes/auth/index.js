const express = require("express");
const router = express.Router();
const {
  registrationController,
  loginController,
  logOutController,
  currentUserController,
  updateUserStatusController,
} = require("../../controller/auth");
const {
  userRegSchema,
  userUpdateSchema,
} = require("../../service/schemas/userJoi");
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
router.patch(
  "/",
  checkJwt,
  validateBody(userUpdateSchema),
  tryCatchWrap(updateUserStatusController)
);

module.exports = router;
