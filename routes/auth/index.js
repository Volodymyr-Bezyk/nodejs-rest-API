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
  userLoginSchema,
  userUpdateSchema,
} = require("../../service/schemas/userJoi");
const { validateBody } = require("../../middlewares/validateBody");
const { tryCatchWrap } = require("../../helpers");
const { checkJwt } = require("../../middlewares/checkJWT");

router.post(
  "/users/register",
  validateBody(userRegSchema),
  tryCatchWrap(registrationController)
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
