const express = require("express");
const router = express.Router();
const {
  registrationController,
  loginController,
  logOutController,
  currentUserController,
  updateUserStatusController,
  verifyUserController,
  repeatedVerification,
} = require("../../controller/auth");
const {
  userRegSchema,
  userLoginSchema,
  userUpdateSchema,
  userVerificationRequestSchema,
} = require("../../service/schemas/userJoi");
const { validateBody } = require("../../middlewares/validateBody");
const { tryCatchWrap } = require("../../helpers");
const { checkJwt } = require("../../middlewares/checkJWT");

router.post(
  "/users/register",
  validateBody(userRegSchema),
  tryCatchWrap(registrationController)
);

router.get(
  "/users/verify/:verificationToken",
  tryCatchWrap(verifyUserController)
);
router.post(
  "/users/verify",
  validateBody(userVerificationRequestSchema),
  tryCatchWrap(repeatedVerification)
);

router.post(
  "/users/login",
  validateBody(userLoginSchema),
  tryCatchWrap(loginController)
);

router.use(checkJwt);
router.post("/users/logout", tryCatchWrap(logOutController));
router.post("/users/current", tryCatchWrap(currentUserController));
router.patch(
  "/users/",
  validateBody(userUpdateSchema),
  tryCatchWrap(updateUserStatusController)
);

module.exports = router;
